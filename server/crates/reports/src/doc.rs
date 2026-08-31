//! The screened document model both renderers consume.
//!
//! # Why the model, and not a renderer, is where compliance lives
//!
//! A report is built once ([`crate::annual_report`]) and rendered twice (XLSX,
//! PDF). If suppression were a rendering concern the two renderers could drift,
//! and a bug in one of them would publish a number TZ §6.2 forbids. So the model
//! carries the compliance properties structurally:
//!
//! 1. **Every numeric cell is a [`Metric`], and a `Metric` can only be built
//!    from a [`compliance::Screened`] value** - which in turn can only come out
//!    of [`compliance::KPolicy`] (AGENTS.md invariant #2). A renderer that wants
//!    a number has to ask [`Metric::visible`], and gets `None` for a suppressed
//!    cell. There is no path from a raw `i64` to a printed digit.
//! 2. **No field can hold a person's name** (invariant #1). Text enters the
//!    model only as a [`Label`], whose constructors accept a `&'static str`
//!    phrase from the [`crate::locale`] tables, a dictionary code validated to
//!    the code shape, or a number or date. `Label::phrase` taking `&'static str`
//!    is the load-bearing part: a `String` read from the database cannot be
//!    passed to it at all.
//!
//! [`ReportDoc::rendered_strings`] enumerates every string a rendered report can
//! contain, which is what makes the guard tests decidable rather than a spot
//! check.

use compliance::Screened;
use serde::Serialize;

use crate::locale::Locale;

/// Longest dictionary code accepted as a label. `domain::DictionaryCode` allows
/// 128 characters; a report label is narrower on purpose.
const MAX_CODE_LEN: usize = 64;

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum LabelError {
    #[error("`{0}` is not a dictionary code - a report label may not hold free text")]
    NotACode(String),
}

/// A dictionary code (`FAC01`, `thesis_bachelor`, `DEP11`) accepted as a label.
///
/// The accepted shape is ASCII alphanumerics plus `_`, `-` and `.`, starting
/// with an alphanumeric. That is the shape every dictionary in this system uses,
/// and it is *not* the shape of a person's name: «Иванов И. И.» fails on the
/// Cyrillic letters, on the spaces and on the length of the surname alike. This
/// is the anti-PII guard of AGENTS.md invariant #1, expressed as a parser.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(transparent)]
pub struct CodeLabel(String);

impl CodeLabel {
    pub fn new(code: &str) -> Result<Self, LabelError> {
        let shaped = !code.is_empty()
            && code.len() <= MAX_CODE_LEN
            && code.starts_with(|c: char| c.is_ascii_alphanumeric())
            && code
                .chars()
                .all(|c| c.is_ascii_alphanumeric() || matches!(c, '_' | '-' | '.'));
        if shaped {
            Ok(Self(code.to_owned()))
        } else {
            Err(LabelError::NotACode(code.chars().take(16).collect()))
        }
    }

    #[must_use]
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

/// A piece of text in a report.
///
/// Every variant either *is* a locale phrase or substitutes typed, non-textual
/// values into one. There is deliberately no `Label::from(String)`.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum Label {
    /// A phrase from a [`crate::locale::Strings`] table.
    Phrase { template: &'static str },
    /// A bare dictionary code, printed as-is.
    Code { code: CodeLabel },
    /// A phrase with one integer substituted into its `{}` placeholder.
    Number { template: &'static str, value: i64 },
    /// A phrase with one date substituted.
    Date {
        template: &'static str,
        date: jiff::civil::Date,
    },
    /// A phrase with a first and last day substituted, in that order.
    Range {
        template: &'static str,
        from: jiff::civil::Date,
        to: jiff::civil::Date,
    },
    /// A phrase with an academic year substituted as `2025–2026`.
    AcademicYear { template: &'static str, year: i16 },
    /// A phrase with a percentage - a configured threshold, say - substituted,
    /// held in hundredths of a percentage point so 65.5 % survives the trip.
    Percent {
        template: &'static str,
        hundredths: u16,
    },
    /// A phrase with one dictionary code substituted.
    Coded {
        template: &'static str,
        code: CodeLabel,
    },
}

impl Label {
    /// A phrase from a locale table.
    ///
    /// The `&'static str` bound is the anti-PII guard: a `String` read from the
    /// database - a work title, a reviewer's name - cannot be passed here.
    ///
    /// ```compile_fail
    /// let name = String::from("Иванов Иван Иванович");
    /// let _leak = reports::Label::phrase(&name);
    /// ```
    #[must_use]
    pub fn phrase(template: &'static str) -> Self {
        Self::Phrase { template }
    }

    pub fn code(code: &str) -> Result<Self, LabelError> {
        Ok(Self::Code {
            code: CodeLabel::new(code)?,
        })
    }

    #[must_use]
    pub fn number(template: &'static str, value: i64) -> Self {
        Self::Number { template, value }
    }

    #[must_use]
    pub fn date(template: &'static str, date: jiff::civil::Date) -> Self {
        Self::Date { template, date }
    }

    #[must_use]
    pub fn range(template: &'static str, from: jiff::civil::Date, to: jiff::civil::Date) -> Self {
        Self::Range { template, from, to }
    }

    #[must_use]
    pub fn academic_year(template: &'static str, year: i16) -> Self {
        Self::AcademicYear { template, year }
    }

    #[must_use]
    pub fn percent(template: &'static str, hundredths: u16) -> Self {
        Self::Percent {
            template,
            hundredths,
        }
    }

    pub fn coded(template: &'static str, code: &str) -> Result<Self, LabelError> {
        Ok(Self::Coded {
            template,
            code: CodeLabel::new(code)?,
        })
    }

    /// The text this label prints in `locale`.
    #[must_use]
    pub fn render(&self, locale: Locale) -> String {
        match self {
            Self::Phrase { template } => (*template).to_owned(),
            Self::Code { code } => code.0.clone(),
            Self::Number { template, value } => fill(template, &[format_integer(*value, locale)]),
            Self::Date { template, date } => fill(template, &[format_date(*date, locale)]),
            Self::Range { template, from, to } => fill(
                template,
                &[format_date(*from, locale), format_date(*to, locale)],
            ),
            Self::AcademicYear { template, year } => fill(
                template,
                // The en dash matches `domain::AcademicYear::label`.
                &[format!("{year}\u{2013}{}", i32::from(*year) + 1)],
            ),
            Self::Percent {
                template,
                hundredths,
            } => fill(template, &[format_threshold(*hundredths, locale)]),
            Self::Coded { template, code } => fill(template, std::slice::from_ref(&code.0)),
        }
    }
}

/// A metric value that has passed k-anonymity screening.
///
/// Constructed only from a [`Screened`], so a caller that has not been through
/// [`compliance::KPolicy`] has nothing to hand in.
#[derive(Debug, Clone, Copy, PartialEq, Serialize)]
#[serde(transparent)]
pub struct Metric(Screened<MetricValue>);

/// What a released metric holds. Formatting (separators, `%`, units) is a
/// rendering concern; the unit is not.
#[derive(Debug, Clone, Copy, PartialEq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum MetricValue {
    /// A count of checks, works or cases.
    Count(i64),
    /// A percentage already expressed in percent, `0.0..=100.0`.
    Percent(f64),
    /// A share in `0.0..=1.0`, printed as a percentage.
    Share(f64),
    /// A duration in seconds.
    Seconds(i64),
    /// The metric exists in the form but has no source at all - «нет данных»
    /// (ADR-008 §9). Distinct from suppression, which hides a number that does
    /// exist.
    Absent,
}

impl Metric {
    /// Wrap an already-screened value.
    #[must_use]
    pub fn new(value: Screened<MetricValue>) -> Self {
        Self(value)
    }

    /// Screen a count against `policy` using the group's own size.
    #[must_use]
    pub fn count(policy: &compliance::KPolicy, observations: u64, value: i64) -> Self {
        Self(policy.screen(observations, MetricValue::Count(value)))
    }

    /// Screen a percentage. A non-finite input (an empty group divided out)
    /// becomes «нет данных» rather than `NaN`.
    #[must_use]
    pub fn percent(policy: &compliance::KPolicy, observations: u64, value: Option<f64>) -> Self {
        Self(policy.screen(observations, finite(value, MetricValue::Percent)))
    }

    /// Screen a share expressed in `0.0..=1.0`.
    #[must_use]
    pub fn share(policy: &compliance::KPolicy, observations: u64, value: Option<f64>) -> Self {
        Self(policy.screen(observations, finite(value, MetricValue::Share)))
    }

    #[must_use]
    pub fn seconds(policy: &compliance::KPolicy, observations: u64, value: Option<i64>) -> Self {
        Self(policy.screen(
            observations,
            value.map_or(MetricValue::Absent, MetricValue::Seconds),
        ))
    }

    /// A metric with no source, still screened: a small group does not get to
    /// learn that its number is merely missing rather than hidden.
    #[must_use]
    pub fn absent(policy: &compliance::KPolicy, observations: u64) -> Self {
        Self(policy.screen(observations, MetricValue::Absent))
    }

    /// Adopt a count screened as part of a whole table by
    /// [`compliance::suppress_table`] - which also applies complementary
    /// suppression, so this is the constructor every multi-row section uses.
    #[must_use]
    pub fn screened_count(value: Screened<i64>) -> Self {
        Self(value.map(MetricValue::Count))
    }

    #[must_use]
    pub fn screened_percent(value: Screened<Option<f64>>) -> Self {
        Self(value.map(|value| finite(value, MetricValue::Percent)))
    }

    #[must_use]
    pub fn screened_share(value: Screened<Option<f64>>) -> Self {
        Self(value.map(|value| finite(value, MetricValue::Share)))
    }

    #[must_use]
    pub fn is_suppressed(&self) -> bool {
        self.0.is_suppressed()
    }

    /// The released value, or `None` when the cell is suppressed. This is the
    /// only door a renderer has to a number.
    #[must_use]
    pub fn visible(&self) -> Option<MetricValue> {
        self.0.visible_value().copied()
    }

    /// The text this cell prints. A suppressed cell prints «недостаточно
    /// данных» and never a digit - asserted in both renderers' tests.
    #[must_use]
    pub fn render(&self, locale: Locale) -> String {
        let strings = locale.strings();
        match self.visible() {
            None => strings.insufficient_data.to_owned(),
            Some(MetricValue::Absent) => strings.no_data.to_owned(),
            Some(MetricValue::Count(value) | MetricValue::Seconds(value)) => {
                format_integer(value, locale)
            }
            Some(MetricValue::Percent(value)) => format_percent(value, locale),
            Some(MetricValue::Share(value)) => format_percent(value * 100.0, locale),
        }
    }
}

fn finite(value: Option<f64>, wrap: fn(f64) -> MetricValue) -> MetricValue {
    match value {
        Some(value) if value.is_finite() => wrap(value),
        _ => MetricValue::Absent,
    }
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(tag = "cell", rename_all = "snake_case")]
pub enum Cell {
    Label(Label),
    Metric(Metric),
}

impl Cell {
    #[must_use]
    pub fn render(&self, locale: Locale) -> String {
        match self {
            Self::Label(label) => label.render(locale),
            Self::Metric(metric) => metric.render(locale),
        }
    }

    #[must_use]
    pub fn metric(&self) -> Option<&Metric> {
        match self {
            Self::Metric(metric) => Some(metric),
            Self::Label(_) => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum Align {
    Start,
    End,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct Column {
    pub header: Label,
    pub align: Align,
}

impl Column {
    #[must_use]
    pub fn text(header: Label) -> Self {
        Self {
            header,
            align: Align::Start,
        }
    }

    #[must_use]
    pub fn numeric(header: Label) -> Self {
        Self {
            header,
            align: Align::End,
        }
    }
}

/// Whether a row is ordinary data or the table's own total, which both renderers
/// set apart typographically.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum RowKind {
    Data,
    Total,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct Row {
    pub cells: Vec<Cell>,
    pub kind: RowKind,
}

impl Row {
    #[must_use]
    pub fn data(cells: Vec<Cell>) -> Self {
        Self {
            cells,
            kind: RowKind::Data,
        }
    }

    #[must_use]
    pub fn total(cells: Vec<Cell>) -> Self {
        Self {
            cells,
            kind: RowKind::Total,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct ReportTable {
    pub columns: Vec<Column>,
    pub rows: Vec<Row>,
}

impl ReportTable {
    /// Every row must have one cell per column, or a renderer would silently
    /// shift values into the wrong column.
    #[must_use]
    pub fn is_rectangular(&self) -> bool {
        self.rows
            .iter()
            .all(|row| row.cells.len() == self.columns.len())
    }
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct ReportSection {
    pub title: Label,
    /// The worksheet tab this section becomes. Excel rejects a sheet name longer
    /// than 31 characters, which several of the TZ §4.5 headings exceed.
    pub short_title: Label,
    pub table: ReportTable,
    pub footnotes: Vec<Label>,
}

/// A complete report, ready to render. Holds no clock and no database handle:
/// the generation date is substituted into `generated_note` by the builder, so
/// rendering the same document twice produces the same bytes.
#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct ReportDoc {
    pub title: Label,
    pub subtitle: Label,
    pub period: Label,
    pub generated_note: Label,
    pub sections: Vec<ReportSection>,
    pub locale: Locale,
}

impl ReportDoc {
    /// Every user-visible string this document renders to, in reading order.
    ///
    /// Both renderers draw from exactly this set - which is what lets the
    /// anti-PII guard tests be exhaustive instead of a spot check.
    #[must_use]
    pub fn rendered_strings(&self) -> Vec<String> {
        let locale = self.locale;
        let mut out = vec![
            self.title.render(locale),
            self.subtitle.render(locale),
            self.period.render(locale),
            self.generated_note.render(locale),
        ];
        for section in &self.sections {
            out.push(section.title.render(locale));
            out.push(section.short_title.render(locale));
            for column in &section.table.columns {
                out.push(column.header.render(locale));
            }
            for row in &section.table.rows {
                for cell in &row.cells {
                    out.push(cell.render(locale));
                }
            }
            for footnote in &section.footnotes {
                out.push(footnote.render(locale));
            }
        }
        out
    }

    /// Positions of every suppressed cell, as `(section, row, column)`. Used by
    /// the renderers' guard tests to prove no number leaked into one.
    #[must_use]
    pub fn suppressed_cells(&self) -> Vec<(usize, usize, usize)> {
        let mut out = Vec::new();
        for (s, section) in self.sections.iter().enumerate() {
            for (r, row) in section.table.rows.iter().enumerate() {
                for (c, cell) in row.cells.iter().enumerate() {
                    if cell.metric().is_some_and(Metric::is_suppressed) {
                        out.push((s, r, c));
                    }
                }
            }
        }
        out
    }
}

/// Substitute `values` into the successive `{}` placeholders of `template`.
fn fill(template: &str, values: &[String]) -> String {
    let mut out = String::with_capacity(template.len() + 16);
    let mut rest = template;
    for value in values {
        let Some((head, tail)) = rest.split_once("{}") else {
            break;
        };
        out.push_str(head);
        out.push_str(value);
        rest = tail;
    }
    out.push_str(rest);
    out
}

/// Group digits in threes with the locale's separator: `20 800`, `20,800`.
fn format_integer(value: i64, locale: Locale) -> String {
    let separator = locale.group_separator();
    let digits = value.unsigned_abs().to_string();
    let mut grouped = String::with_capacity(digits.len() + digits.len() / 3 + 1);
    if value < 0 {
        grouped.push('-');
    }
    for (index, digit) in digits.chars().enumerate() {
        if index > 0 && (digits.len() - index).is_multiple_of(3) {
            grouped.push(separator);
        }
        grouped.push(digit);
    }
    grouped
}

/// Two decimals, the locale's decimal separator, and a non-breaking space before
/// the percent sign so «76,47 %» never wraps.
fn format_percent(value: f64, locale: Locale) -> String {
    let rendered = format!("{value:.2}");
    let (whole, fraction) = rendered
        .split_once('.')
        .unwrap_or((rendered.as_str(), "00"));
    let whole: i64 = whole.parse().unwrap_or_default();
    format!(
        "{}{}{}\u{a0}%",
        format_integer(whole, locale),
        locale.decimal_separator(),
        fraction
    )
}

/// A configured threshold: `70` when it is a whole percent, `65,50` otherwise.
fn format_threshold(hundredths: u16, locale: Locale) -> String {
    let whole = i64::from(hundredths / 100);
    if hundredths.is_multiple_of(100) {
        format_integer(whole, locale)
    } else {
        format!(
            "{}{}{:02}",
            format_integer(whole, locale),
            locale.decimal_separator(),
            hundredths % 100
        )
    }
}

fn format_date(date: jiff::civil::Date, locale: Locale) -> String {
    match locale {
        // The RU/KK format of the source exports and of the printed form.
        Locale::Ru | Locale::Kk => {
            format!("{:02}.{:02}.{:04}", date.day(), date.month(), date.year())
        }
        Locale::En => format!("{:04}-{:02}-{:02}", date.year(), date.month(), date.day()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use compliance::{KPolicy, KThreshold};

    fn policy(k: u32) -> KPolicy {
        KPolicy::new(KThreshold::new(k).expect("test threshold is non-zero"))
    }

    /// The structural half of AGENTS.md invariant #1: the only door text has
    /// into the model rejects everything that looks like a person.
    #[test]
    fn a_label_cannot_be_built_from_a_persons_name() {
        for name in [
            "Иванов И. И.",
            "Иванов Иван Иванович",
            "Ivanov I. I.",
            "petrova.ms@teachers.tou.edu.kz",
            "Диссертация Иванова о морфологии почв",
            "",
            " ",
            "FAC 01",
        ] {
            assert!(
                CodeLabel::new(name).is_err(),
                "`{name}` must not be usable as a report label"
            );
        }

        // …while every dictionary code the warehouse actually produces is.
        for code in [
            "FAC01",
            "UNASSIGNED",
            "thesis_bachelor",
            "DEP11",
            "6B06103",
            "research_report",
        ] {
            assert!(
                CodeLabel::new(code).is_ok(),
                "`{code}` is a dictionary code"
            );
        }
    }

    /// The `compile_fail` half of this property lives on [`Label::phrase`].
    #[test]
    fn phrase_only_accepts_a_compile_time_template() {
        assert_eq!(
            Label::phrase("Итого").render(Locale::Ru),
            "Итого",
            "a phrase renders verbatim"
        );
    }

    #[test]
    fn a_suppressed_metric_never_renders_a_digit() {
        let hidden = Metric::count(&policy(5), 3, 4_321);
        assert!(hidden.is_suppressed());
        assert_eq!(hidden.visible(), None);
        for locale in Locale::ALL {
            let rendered = hidden.render(locale);
            assert_eq!(rendered, locale.strings().insufficient_data);
            assert!(
                !rendered.chars().any(|c| c.is_ascii_digit()),
                "{locale:?}: a suppressed cell printed `{rendered}`"
            );
        }

        // A non-finite metric is «нет данных», not `NaN` - and is still screened.
        let absent = Metric::percent(&policy(5), 9, None);
        assert_eq!(absent.render(Locale::Ru), "нет данных");
        assert!(Metric::percent(&policy(5), 2, Some(91.75)).is_suppressed());
    }

    #[test]
    fn numbers_are_formatted_per_locale() {
        assert_eq!(
            Metric::count(&policy(5), 20_800, 20_800).render(Locale::Ru),
            "20\u{a0}800"
        );
        assert_eq!(
            Metric::count(&policy(5), 20_800, 20_800).render(Locale::En),
            "20,800"
        );
        assert_eq!(
            Metric::percent(&policy(5), 99, Some(76.4711)).render(Locale::Ru),
            "76,47\u{a0}%"
        );
        assert_eq!(
            Metric::share(&policy(5), 99, Some(0.2936)).render(Locale::Kk),
            "29,36\u{a0}%"
        );
        assert_eq!(
            Metric::seconds(&policy(5), 99, Some(1_234)).render(Locale::Ru),
            "1\u{a0}234"
        );
        assert_eq!(
            Metric::seconds(&policy(5), 99, None).render(Locale::Ru),
            "нет данных"
        );
    }

    #[test]
    fn templates_substitute_typed_values_only() {
        assert_eq!(
            Label::academic_year("Учебный год {}", 2025).render(Locale::Ru),
            "Учебный год 2025–2026"
        );
        assert_eq!(
            Label::range(
                "Период: {} - {}",
                jiff::civil::date(2025, 9, 1),
                jiff::civil::date(2026, 8, 31),
            )
            .render(Locale::Ru),
            "Период: 01.09.2025 - 31.08.2026"
        );
        assert_eq!(
            Label::date("Generated on {}", jiff::civil::date(2026, 9, 1)).render(Locale::En),
            "Generated on 2026-09-01"
        );
        assert_eq!(
            Label::number("Доля работ ниже порога {} %, %", 70).render(Locale::Ru),
            "Доля работ ниже порога 70 %, %"
        );
        assert_eq!(
            Label::coded("{}", "FAC01")
                .expect("a dictionary code")
                .render(Locale::Ru),
            "FAC01"
        );
    }
}
