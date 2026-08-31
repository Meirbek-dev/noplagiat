//! The Приложение-1 report builder (TZ §4.5, docs/PLAN.md W4.1).
//!
//! Seven tables, in the order the printed form lists them: общие показатели; по
//! типам работ; распределение по диапазонам; по факультетам; повторные проверки;
//! эскалации; использование системы. Metric definitions follow ADR-008 §9, and
//! every number is read through [`db::q`] with [`Scope::All`] - the annual report
//! is a university-wide document.
//!
//! # Screening
//!
//! The annual report is **published** (TZ §4.5 «доступны для публикации на
//! портале»), so k-anonymity applies to it exactly as it does to the public
//! dashboard. Multi-row sections go through [`compliance::suppress_table`], which
//! adds complementary suppression: without it a hidden faculty would be the
//! difference between the visible total and the visible rest of the column.
//!
//! Count and mean of the same row are screened **together**, against one shared
//! observation vector. A visible mean over a hidden count would betray the group
//! it was computed from.

use compliance::{AggregateCell, KPolicy, Scope, ScreenedTable, suppress_table};
use db::Pool;
use db::q::{self, UnitDepth};
use domain::{AcademicYear, Filters, Period};

use crate::doc::{Cell, Column, Label, Metric, ReportDoc, ReportSection, ReportTable, Row};
use crate::locale::Locale;
use crate::{ReportError, locale::Strings};

/// Build the Приложение-1 report for one academic year (Sep 1 – Aug 31).
///
/// `generated_on` is a parameter, never `Date::today()`: two runs over the same
/// warehouse state must produce identical files, which is what makes the
/// snapshot content hash worth recording.
pub async fn annual_report(
    pool: &Pool,
    academic_year: AcademicYear,
    locale: Locale,
    policy: KPolicy,
    generated_on: jiff::civil::Date,
) -> Result<ReportDoc, ReportError> {
    let AcademicYear(year) = academic_year;
    let period = Period::new(
        jiff::civil::date(year, 9, 1),
        jiff::civil::date(year + 1, 8, 31),
    )?;
    let strings = locale.strings();
    build(
        pool,
        period,
        locale,
        policy,
        generated_on,
        Label::academic_year(strings.period_academic_year, year),
    )
    .await
}

/// The same seven tables over an arbitrary period (TZ §4.5 «с возможностью
/// ручного запуска за произвольный период»).
pub async fn period_report(
    pool: &Pool,
    period: Period,
    locale: Locale,
    policy: KPolicy,
    generated_on: jiff::civil::Date,
) -> Result<ReportDoc, ReportError> {
    let strings = locale.strings();
    build(
        pool,
        period,
        locale,
        policy,
        generated_on,
        Label::range(strings.period_range, period.start(), period.end()),
    )
    .await
}

async fn build(
    pool: &Pool,
    period: Period,
    locale: Locale,
    policy: KPolicy,
    generated_on: jiff::civil::Date,
    period_label: Label,
) -> Result<ReportDoc, ReportError> {
    let strings = locale.strings();
    let filters = Filters::new(period);
    let threshold = db::settings::originality_threshold(pool).await?;

    let summary = q::summary(pool, &filters, Scope::All).await?;
    let coverage = q::coverage(pool, &filters, Scope::All).await?;
    let work_types = q::work_types(pool, &filters, Scope::All).await?;
    let histogram = q::histogram(pool, &filters, Scope::All).await?;
    let units = q::units(pool, &filters, Scope::All, UnitDepth::Faculty).await?;
    let rechecks = q::rechecks(pool, &filters, Scope::All).await?;
    let escalations = q::escalations(pool, &filters, Scope::All).await?;
    let usage = q::usage(pool, &filters, Scope::All).await?;

    let sections = vec![
        summary_section(strings, &policy, &summary, &coverage, threshold)?,
        work_types_section(strings, &policy, &summary, &work_types)?,
        buckets_section(strings, &policy, &histogram)?,
        faculties_section(strings, &policy, &summary, &units)?,
        rechecks_section(strings, &policy, &rechecks),
        escalations_section(strings, &policy, &summary, &escalations),
        usage_section(strings, &policy, &summary, &usage),
    ];

    Ok(ReportDoc {
        title: Label::phrase(strings.report_title),
        subtitle: Label::phrase(strings.report_subtitle),
        period: period_label,
        generated_note: Label::date(strings.generated_on, generated_on),
        sections,
        locale,
    })
}

/// The k-anonymity footnote every screened section carries, so a reader knows a
/// «недостаточно данных» cell is a rule and not a gap in the data.
fn k_note(strings: &'static Strings, policy: &KPolicy) -> Label {
    Label::number(
        strings.note_k_anonymity,
        i64::from(policy.threshold().get()),
    )
}

/// A group size as the `u64` [`KPolicy::screen`] takes. Counts out of SQL are
/// non-negative; a negative one would be a bug, and screening it as zero
/// observations hides the cell rather than publishing it.
fn observations(count: i64) -> u64 {
    u64::try_from(count).unwrap_or(0)
}

/// Screen a section's counts and means as one table.
///
/// Both calls see the same observation vector, so `suppress_table` - primary and
/// complementary suppression alike - hides exactly the same rows in each. A row
/// therefore never shows a mean next to a hidden count.
fn screen_pair(
    policy: &KPolicy,
    rows: &[(u64, i64, Option<f64>)],
    total_count: i64,
    total_mean: Option<f64>,
) -> Result<(ScreenedTable<i64>, ScreenedTable<Option<f64>>), ReportError> {
    let counts = suppress_table(
        policy,
        total_count,
        rows.iter()
            .map(|(observed, count, _)| AggregateCell::new(*observed, *count))
            .collect(),
    )?;
    let means = suppress_table(
        policy,
        total_mean,
        rows.iter()
            .map(|(observed, _, mean)| AggregateCell::new(*observed, *mean))
            .collect(),
    )?;
    Ok((counts, means))
}

/// `[label, count, mean]` rows plus the «Итого» row, shared by sections 2 and 4.
fn count_and_mean_table(
    strings: &'static Strings,
    first_column: Label,
    labels: Vec<Label>,
    counts: &ScreenedTable<i64>,
    means: &ScreenedTable<Option<f64>>,
) -> ReportTable {
    let mut rows: Vec<Row> = labels
        .into_iter()
        .zip(counts.cells().iter().zip(means.cells()))
        .map(|(label, (count, mean))| {
            Row::data(vec![
                Cell::Label(label),
                Cell::Metric(Metric::screened_count(*count)),
                Cell::Metric(Metric::screened_percent(*mean)),
            ])
        })
        .collect();
    rows.push(Row::total(vec![
        Cell::Label(Label::phrase(strings.total)),
        Cell::Metric(Metric::screened_count(*counts.total())),
        Cell::Metric(Metric::screened_percent(*means.total())),
    ]));

    ReportTable {
        columns: vec![
            Column::text(first_column),
            Column::numeric(Label::phrase(strings.column_checks)),
            Column::numeric(Label::phrase(strings.column_avg_originality)),
        ],
        rows,
    }
}

// ── 1. Общие показатели ──────────────────────────────────────────────────────

fn summary_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &q::SummaryRow,
    coverage: &[q::CoverageRow],
    threshold: domain::OriginalityPct,
) -> Result<ReportSection, ReportError> {
    let observed = observations(summary.checks);
    let metric =
        |label: Label, value: Metric| Row::data(vec![Cell::Label(label), Cell::Metric(value)]);

    let mut rows = vec![
        metric(
            Label::phrase(strings.metric_checks_total),
            Metric::count(policy, observed, summary.checks),
        ),
        metric(
            Label::phrase(strings.metric_avg_originality),
            Metric::percent(policy, observed, summary.avg_originality()),
        ),
        metric(
            Label::percent(strings.metric_below_threshold, threshold.hundredths()),
            Metric::share(policy, observed, summary.below_threshold_share()),
        ),
        metric(
            Label::phrase(strings.metric_escalated),
            Metric::count(policy, observed, summary.escalated),
        ),
    ];

    let mut footnotes = vec![k_note(strings, policy)];
    // TZ §4.2 §1 «при наличии данных»: with no registrar denominators the row is
    // omitted and said to be omitted - never estimated, never shown as zero.
    if coverage.is_empty() {
        footnotes.push(Label::phrase(strings.note_coverage_missing));
    } else {
        let checks: i64 = coverage.iter().map(|row| row.checks).sum();
        let submitted: i64 = coverage
            .iter()
            .map(|row| i64::from(row.total_submitted))
            .sum();
        #[expect(
            clippy::cast_precision_loss,
            reason = "both counts are bounded by the fact table size, far inside \
                      f64's exact integer range"
        )]
        let share = (submitted > 0).then(|| checks as f64 / submitted as f64);
        rows.push(metric(
            Label::phrase(strings.metric_coverage),
            Metric::share(policy, observed, share),
        ));
    }

    Ok(ReportSection {
        title: Label::phrase(strings.section_summary),
        short_title: Label::phrase(strings.sheet_summary),
        table: ReportTable {
            columns: vec![
                Column::text(Label::phrase(strings.column_metric)),
                Column::numeric(Label::phrase(strings.column_value)),
            ],
            rows,
        },
        footnotes,
    })
}

// ── 2. Распределение по типам работ ──────────────────────────────────────────

fn work_types_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &q::SummaryRow,
    work_types: &[q::WorkTypeRow],
) -> Result<ReportSection, ReportError> {
    let cells: Vec<(u64, i64, Option<f64>)> = work_types
        .iter()
        .map(|row| (observations(row.checks), row.checks, row.avg_originality()))
        .collect();
    let labels = work_types
        .iter()
        .map(|row| dictionary_label(strings.work_type(&row.code), &row.code))
        .collect::<Result<Vec<_>, _>>()?;

    let (counts, means) = screen_pair(policy, &cells, summary.checks, summary.avg_originality())?;

    Ok(ReportSection {
        title: Label::phrase(strings.section_work_types),
        short_title: Label::phrase(strings.sheet_work_types),
        table: count_and_mean_table(
            strings,
            Label::phrase(strings.column_work_type),
            labels,
            &counts,
            &means,
        ),
        footnotes: vec![k_note(strings, policy)],
    })
}

// ── 3. Распределение по диапазонам оригинальности ────────────────────────────

fn buckets_section(
    strings: &'static Strings,
    policy: &KPolicy,
    histogram: &q::HistogramRow,
) -> Result<ReportSection, ReportError> {
    let total = histogram.total();
    let counts = suppress_table(
        policy,
        total,
        histogram
            .counts()
            .into_iter()
            .map(|count| AggregateCell::new(observations(count), count))
            .collect(),
    )?;
    #[expect(
        clippy::cast_precision_loss,
        reason = "band counts are bounded by the fact table size"
    )]
    let share = |count: i64| (total > 0).then(|| count as f64 / total as f64);
    let shares = suppress_table(
        policy,
        share(total),
        histogram
            .counts()
            .into_iter()
            .map(|count| AggregateCell::new(observations(count), share(count)))
            .collect(),
    )?;

    let mut rows: Vec<Row> = strings
        .buckets()
        .into_iter()
        .zip(counts.cells().iter().zip(shares.cells()))
        .map(|(band, (count, share))| {
            Row::data(vec![
                Cell::Label(Label::phrase(band)),
                Cell::Metric(Metric::screened_count(*count)),
                Cell::Metric(Metric::screened_share(*share)),
            ])
        })
        .collect();
    rows.push(Row::total(vec![
        Cell::Label(Label::phrase(strings.total)),
        Cell::Metric(Metric::screened_count(*counts.total())),
        Cell::Metric(Metric::screened_share(*shares.total())),
    ]));

    Ok(ReportSection {
        title: Label::phrase(strings.section_buckets),
        short_title: Label::phrase(strings.sheet_buckets),
        table: ReportTable {
            columns: vec![
                Column::text(Label::phrase(strings.column_bucket)),
                Column::numeric(Label::phrase(strings.column_checks)),
                Column::numeric(Label::phrase(strings.column_share)),
            ],
            rows,
        },
        footnotes: vec![k_note(strings, policy)],
    })
}

// ── 4. Распределение по факультетам ──────────────────────────────────────────

fn faculties_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &q::SummaryRow,
    units: &[q::UnitRow],
) -> Result<ReportSection, ReportError> {
    let cells: Vec<(u64, i64, Option<f64>)> = units
        .iter()
        .map(|row| (observations(row.checks), row.checks, row.avg_originality()))
        .collect();
    let labels = units
        .iter()
        .map(|row| dictionary_label(strings.unit(&row.faculty_code), &row.faculty_code))
        .collect::<Result<Vec<_>, _>>()?;

    let (counts, means) = screen_pair(policy, &cells, summary.checks, summary.avg_originality())?;

    // The promise that a unit breakdown exists is only true once the data holds
    // one. While every row is the `UNASSIGNED` sentinel of migration 0002 - the
    // state until the reviewer-to-unit mapping is loaded - a note describing
    // that mapping reads as a claim contradicted by the table right above it,
    // so the note says what is actually missing instead.
    let mapped = units.iter().any(|row| row.faculty_code != "UNASSIGNED");
    let mut footnotes = vec![
        k_note(strings, policy),
        Label::phrase(if mapped {
            strings.note_units_current_mapping
        } else {
            strings.note_units_pending_mapping
        }),
    ];
    if units.iter().any(|row| row.faculty_code == "UNASSIGNED") {
        footnotes.push(Label::phrase(strings.note_unassigned_unit));
    }

    Ok(ReportSection {
        title: Label::phrase(strings.section_faculties),
        short_title: Label::phrase(strings.sheet_faculties),
        table: count_and_mean_table(
            strings,
            Label::phrase(strings.column_faculty),
            labels,
            &counts,
            &means,
        ),
        footnotes,
    })
}

// ── 5. Повторные проверки ────────────────────────────────────────────────────

fn rechecks_section(
    strings: &'static Strings,
    policy: &KPolicy,
    rechecks: &q::RechecksRow,
) -> ReportSection {
    let works = observations(rechecks.works_total);
    // The improvement share is a statement about the rechecked works, so that is
    // the group it is screened against - not the larger set of all works.
    let rechecked = observations(rechecks.works_rechecked);
    #[expect(
        clippy::cast_precision_loss,
        reason = "distinct-work counts are bounded by the fact table size"
    )]
    let ratio = |numerator: i64, denominator: i64| {
        (denominator > 0).then(|| numerator as f64 / denominator as f64)
    };

    let metric =
        |label: Label, value: Metric| Row::data(vec![Cell::Label(label), Cell::Metric(value)]);
    let rows = vec![
        metric(
            Label::phrase(strings.metric_works_total),
            Metric::count(policy, works, rechecks.works_total),
        ),
        metric(
            Label::phrase(strings.metric_works_rechecked),
            Metric::count(policy, rechecked, rechecks.works_rechecked),
        ),
        metric(
            Label::phrase(strings.metric_recheck_share),
            Metric::share(
                policy,
                works,
                ratio(rechecks.works_rechecked, rechecks.works_total),
            ),
        ),
        metric(
            Label::phrase(strings.metric_improved_share),
            Metric::share(
                policy,
                rechecked,
                ratio(rechecks.improved, rechecks.works_rechecked),
            ),
        ),
    ];

    ReportSection {
        title: Label::phrase(strings.section_rechecks),
        short_title: Label::phrase(strings.sheet_rechecks),
        table: ReportTable {
            columns: vec![
                Column::text(Label::phrase(strings.column_metric)),
                Column::numeric(Label::phrase(strings.column_value)),
            ],
            rows,
        },
        footnotes: vec![k_note(strings, policy)],
    }
}

// ── 6. Эскалации ─────────────────────────────────────────────────────────────

fn escalations_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &q::SummaryRow,
    escalations: &q::EscalationsRow,
) -> ReportSection {
    let observed = observations(summary.checks);
    let mut rows = vec![Row::data(vec![
        Cell::Label(Label::phrase(strings.metric_escalated_checks)),
        Cell::Metric(Metric::count(
            policy,
            observed,
            escalations.checks_escalated,
        )),
        // The derived flag has no «рассмотрено» counterpart; the Ethics Council
        // rows below do. The two are never added together (ADR-008 §9).
        Cell::Metric(Metric::absent(policy, observed)),
    ])];

    for case in &escalations.ethics_cases {
        let referred = i64::from(case.referred);
        let group = observations(referred);
        rows.push(Row::data(vec![
            // An Ethics Council category is admin-entered. It reaches the report
            // only if it is code-shaped; anything else prints as «иная
            // категория» rather than being copied through (invariant #1).
            Cell::Label(
                Label::code(&case.category)
                    .unwrap_or_else(|_| Label::phrase(strings.category_other)),
            ),
            Cell::Metric(Metric::count(policy, group, referred)),
            Cell::Metric(Metric::count(
                policy,
                group,
                i64::from(case.reviewed_closed),
            )),
        ]));
    }

    ReportSection {
        title: Label::phrase(strings.section_escalations),
        short_title: Label::phrase(strings.sheet_escalations),
        table: ReportTable {
            columns: vec![
                Column::text(Label::phrase(strings.column_category)),
                Column::numeric(Label::phrase(strings.column_referred)),
                Column::numeric(Label::phrase(strings.column_reviewed)),
            ],
            rows,
        },
        footnotes: vec![
            k_note(strings, policy),
            Label::phrase(strings.note_ethics_separate),
        ],
    }
}

// ── 7. Использование системы ─────────────────────────────────────────────────

fn usage_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &q::SummaryRow,
    usage: &[q::UsagePoint],
) -> ReportSection {
    let months = i64::try_from(usage.len()).unwrap_or(i64::MAX);
    let reviewers: Vec<i64> = usage.iter().map(|point| point.active_reviewers).collect();
    let peak = reviewers.iter().copied().max();
    // Integer mean, rounded half-up - no float, so the printed figure does not
    // depend on the platform's rounding mode.
    let mean = (months > 0).then(|| (reviewers.iter().sum::<i64>() + months / 2) / months);
    // The smallest month is the group an average over the year could expose, so
    // it is what the average is screened against.
    let smallest = observations(reviewers.iter().copied().min().unwrap_or(0));

    let durations: Vec<i64> = usage
        .iter()
        .filter_map(|point| point.avg_check_seconds.map(i64::from))
        .collect();
    let sampled = i64::try_from(durations.len()).unwrap_or(i64::MAX);
    let duration = (sampled > 0).then(|| (durations.iter().sum::<i64>() + sampled / 2) / sampled);

    let metric =
        |label: Label, value: Metric| Row::data(vec![Cell::Label(label), Cell::Metric(value)]);
    let rows = vec![
        metric(
            Label::phrase(strings.metric_active_reviewers_avg),
            match mean {
                Some(mean) => Metric::count(policy, smallest, mean),
                None => Metric::absent(policy, observations(summary.checks)),
            },
        ),
        metric(
            Label::phrase(strings.metric_active_reviewers_max),
            match peak {
                Some(peak) => Metric::count(policy, observations(peak), peak),
                None => Metric::absent(policy, observations(summary.checks)),
            },
        ),
        metric(
            Label::phrase(strings.metric_avg_check_seconds),
            Metric::seconds(policy, observations(summary.checks), duration),
        ),
    ];

    let mut footnotes = vec![k_note(strings, policy)];
    if duration.is_none() {
        footnotes.push(Label::phrase(strings.note_no_duration));
    }

    ReportSection {
        title: Label::phrase(strings.section_usage),
        short_title: Label::phrase(strings.sheet_usage),
        table: ReportTable {
            columns: vec![
                Column::text(Label::phrase(strings.column_metric)),
                Column::numeric(Label::phrase(strings.column_value)),
            ],
            rows,
        },
        footnotes,
    }
}

/// A localized dictionary name when this build knows the code, the code itself
/// otherwise. Never an invented name, and never free text.
fn dictionary_label(known: Option<&'static str>, code: &str) -> Result<Label, ReportError> {
    match known {
        Some(phrase) => Ok(Label::phrase(phrase)),
        None => Ok(Label::code(code)?),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use compliance::KThreshold;

    fn policy(k: u32) -> KPolicy {
        KPolicy::new(KThreshold::new(k).expect("test threshold is non-zero"))
    }

    /// The count and the mean of a row are hidden together. A visible mean over
    /// a hidden count would publish the group the mean was taken over.
    #[test]
    fn a_row_never_shows_a_mean_next_to_a_hidden_count() {
        let rows = vec![
            (3_u64, 3_i64, Some(80.0)),
            (5, 5, Some(70.0)),
            (400, 400, Some(76.0)),
        ];
        let (counts, means) =
            screen_pair(&policy(5), &rows, 408, Some(76.1)).expect("small fixture");

        for (count, mean) in counts.cells().iter().zip(means.cells()) {
            assert_eq!(
                count.is_suppressed(),
                mean.is_suppressed(),
                "count and mean must be screened as one cell"
            );
        }
        assert!(counts.cells()[0].is_suppressed(), "n = 3 is below k = 5");
        assert!(
            counts.cells()[1].is_suppressed(),
            "complementary suppression must close the total"
        );
    }

    fn summary_of(checks: i64) -> q::SummaryRow {
        q::SummaryRow {
            checks,
            sum_originality_hundredths: checks * 7_600,
            below_threshold: 0,
            escalated: 0,
        }
    }

    fn unit_of(code: &str, checks: i64) -> q::UnitRow {
        q::UnitRow {
            faculty_code: code.to_owned(),
            department_code: None,
            checks,
            sum_originality_hundredths: checks * 7_600,
        }
    }

    fn footnotes_of(units: &[q::UnitRow], locale: Locale) -> Vec<String> {
        let checks = units.iter().map(|row| row.checks).sum();
        faculties_section(locale.strings(), &policy(5), &summary_of(checks), units)
            .expect("the fixture table is well formed")
            .footnotes
            .iter()
            .map(|note| note.render(locale))
            .collect()
    }

    /// The unit footnote has to describe the data that is actually in the table.
    /// While every row is «Не распределено» there is no breakdown to promise.
    #[test]
    fn the_unit_footnote_follows_the_data() {
        for locale in Locale::ALL {
            let strings = locale.strings();
            let since = strings.note_units_current_mapping.to_owned();
            let pending = strings.note_units_pending_mapping.to_owned();

            let sentinel_only = footnotes_of(&[unit_of("UNASSIGNED", 400)], locale);
            assert!(
                sentinel_only.contains(&pending),
                "{locale:?}: an all-UNASSIGNED table must say the mapping is missing: \
                 {sentinel_only:?}"
            );
            assert!(
                !sentinel_only.contains(&since),
                "{locale:?}: nothing is broken down by unit, so nothing is available"
            );

            let mapped = footnotes_of(&[unit_of("FAC01", 200), unit_of("UNASSIGNED", 200)], locale);
            assert!(
                mapped.contains(&since),
                "{locale:?}: a real faculty is present, so the breakdown exists: {mapped:?}"
            );
            assert!(!mapped.contains(&pending), "{locale:?}: {mapped:?}");
            assert!(
                mapped.contains(&strings.note_unassigned_unit.to_owned()),
                "{locale:?}: the sentinel row still needs its own explanation"
            );
        }
    }

    #[test]
    fn observations_never_turn_a_negative_count_into_a_visible_cell() {
        assert_eq!(observations(-1), 0);
        assert!(Metric::count(&policy(1), observations(-1), -1).is_suppressed());
    }
}
