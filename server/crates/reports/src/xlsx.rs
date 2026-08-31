//! XLSX rendering (TZ §4.4 «Excel - для дальнейшей обработки»).
//!
//! One worksheet per [`ReportSection`], each carrying the same branded masthead
//! so a single sheet remains self-describing when it is copied out of the
//! workbook. Released numbers are written as **numbers** with a display format,
//! never as pre-formatted text: the point of the XLSX export is that the
//! recipient can compute with it. Suppressed cells are the one exception - they
//! are text, «недостаточно данных», because there is no number to write.

use rust_xlsxwriter::{Color, Format, FormatAlign, FormatBorder, Workbook, Worksheet, XlsxError};

use crate::brand;
use crate::doc::{Cell, MetricValue, ReportDoc, ReportSection, RowKind};
use crate::{RenderOptions, ReportError};

/// Excel's hard limit on a worksheet name.
const MAX_SHEET_NAME: usize = 31;

/// Characters Excel forbids in a worksheet name.
const FORBIDDEN_IN_SHEET_NAME: [char; 7] = ['[', ']', ':', '*', '?', '/', '\\'];

/// Widest column autofit may produce, in pixels. Without a cap the masthead
/// rows - which are long single-cell sentences - would stretch the first column
/// past the printable page.
const MAX_AUTOFIT_PIXELS: u32 = 320;

/// Decimal places a released fraction is written with.
///
/// The same precision the JSON contract publishes (`api::dto::round4`, which is
/// the precision of `fixtures/expected.json`), so a share read out of the
/// workbook is the number the API returns and not the binary residue of the
/// division that produced it - `0.30000000000000004` rather than `0.3`. Counts
/// are exact integers and are never put through this.
const RELEASED_DECIMALS: f64 = 10_000.0;

/// Render `doc` as a workbook.
pub fn render_xlsx(doc: &ReportDoc, options: &RenderOptions) -> Result<Vec<u8>, ReportError> {
    let palette = Palette::new();
    let mut workbook = Workbook::new();

    for section in &doc.sections {
        if !section.table.is_rectangular() {
            return Err(ReportError::MalformedTable);
        }
        let sheet = workbook.add_worksheet();
        write_section(sheet, doc, section, options, &palette)?;
    }

    Ok(workbook.save_to_buffer()?)
}

fn write_section(
    sheet: &mut Worksheet,
    doc: &ReportDoc,
    section: &ReportSection,
    options: &RenderOptions,
    palette: &Palette,
) -> Result<(), XlsxError> {
    let locale = doc.locale;
    let strings = locale.strings();
    let last_column = u16::try_from(section.table.columns.len().saturating_sub(1)).unwrap_or(0);

    sheet.set_name(sheet_name(&section.short_title.render(locale)))?;

    // ── masthead ────────────────────────────────────────────────────────────
    let mut row = 0;
    sheet.write_string_with_format(row, 0, brand::ORGANIZATION_LOCKUP, &palette.lockup)?;
    row += 1;
    sheet.write_string_with_format(row, 0, doc.title.render(locale), &palette.title)?;
    // Paint the rest of the banner row so the navy block spans the table.
    for column in 1..=last_column {
        sheet.write_string_with_format(row, column, "", &palette.title)?;
    }
    row += 1;
    sheet.write_string_with_format(row, 0, doc.subtitle.render(locale), &palette.subtitle)?;
    row += 1;
    sheet.write_string_with_format(row, 0, doc.period.render(locale), &palette.meta)?;
    row += 1;
    sheet.write_string_with_format(row, 0, doc.generated_note.render(locale), &palette.meta)?;
    row += 1;
    if options.internal {
        sheet.write_string_with_format(row, 0, strings.internal_marking, &palette.marking)?;
        row += 1;
    }

    row += 1;
    sheet.write_string_with_format(row, 0, section.title.render(locale), &palette.section)?;
    row += 2;

    // ── table ───────────────────────────────────────────────────────────────
    let header_row = row;
    for (index, column) in section.table.columns.iter().enumerate() {
        let at = u16::try_from(index).unwrap_or(u16::MAX);
        sheet.write_string_with_format(
            header_row,
            at,
            column.header.render(locale),
            &palette.head,
        )?;
    }
    row += 1;

    for body in &section.table.rows {
        for (index, cell) in body.cells.iter().enumerate() {
            let at = u16::try_from(index).unwrap_or(u16::MAX);
            write_cell(sheet, row, at, cell, doc, body.kind, palette)?;
        }
        row += 1;
    }

    // ── footnotes ───────────────────────────────────────────────────────────
    row += 1;
    for footnote in &section.footnotes {
        sheet.write_string_with_format(row, 0, footnote.render(locale), &palette.footnote)?;
        row += 1;
    }

    // TZ §4.4: the marking has to survive printing, so it also goes into the
    // page header; the footer carries the report title and page numbers.
    if options.internal {
        sheet.set_header(format!("&C{}", strings.internal_marking));
    }
    sheet.set_footer(format!("&L{}&R&P / &N", doc.title.render(locale)));

    sheet.set_freeze_panes(header_row + 1, 0)?;
    sheet.set_autofit_max_width(MAX_AUTOFIT_PIXELS);
    sheet.autofit();
    Ok(())
}

fn write_cell(
    sheet: &mut Worksheet,
    row: u32,
    column: u16,
    cell: &Cell,
    doc: &ReportDoc,
    kind: RowKind,
    palette: &Palette,
) -> Result<(), XlsxError> {
    let locale = doc.locale;
    let total = kind == RowKind::Total;
    match cell {
        Cell::Label(label) => {
            let format = if total {
                &palette.total_text
            } else {
                &palette.text
            };
            sheet.write_string_with_format(row, column, label.render(locale), format)?;
        }
        Cell::Metric(metric) => match metric.visible() {
            // A suppressed cell, and a metric with no source, are text: there is
            // no number to hand to the recipient's spreadsheet.
            None | Some(MetricValue::Absent) => {
                let format = if total {
                    &palette.total_marker
                } else {
                    &palette.marker
                };
                sheet.write_string_with_format(row, column, metric.render(locale), format)?;
            }
            Some(MetricValue::Count(value) | MetricValue::Seconds(value)) => {
                let format = if total {
                    &palette.total_count
                } else {
                    &palette.count
                };
                #[expect(
                    clippy::cast_precision_loss,
                    reason = "counts are bounded by the fact table size, far inside \
                              f64's exact integer range - and XLSX has no integer cell type"
                )]
                sheet.write_number_with_format(row, column, value as f64, format)?;
            }
            // Excel percent formats multiply by 100 on display, so the stored
            // value is the fraction. The recipient gets a real percentage they
            // can compute with, not a string that looks like one.
            Some(MetricValue::Percent(value)) => {
                let format = if total {
                    &palette.total_percent
                } else {
                    &palette.percent
                };
                sheet.write_number_with_format(row, column, percent_as_fraction(value), format)?;
            }
            Some(MetricValue::Share(value)) => {
                let format = if total {
                    &palette.total_percent
                } else {
                    &palette.percent
                };
                sheet.write_number_with_format(row, column, round_released(value), format)?;
            }
        },
    }
    Ok(())
}

/// A share in `0.0..=1.0` at the contract's precision.
fn round_released(value: f64) -> f64 {
    (value * RELEASED_DECIMALS).round() / RELEASED_DECIMALS
}

/// A percentage in `0.0..=100.0` as the fraction Excel's percent format expects.
///
/// The *percentage* is what carries four decimals - that is the unit the JSON
/// contract rounds - so the rounding happens before the division rather than
/// after it, and the division is by a power of ten so that the stored double is
/// the nearest one to that decimal rather than a two-step artefact.
fn percent_as_fraction(value: f64) -> f64 {
    (value * RELEASED_DECIMALS).round() / (RELEASED_DECIMALS * 100.0)
}

/// Excel rejects a name over 31 characters or containing `[]:*?/\`.
fn sheet_name(title: &str) -> String {
    title
        .chars()
        .filter(|c| !FORBIDDEN_IN_SHEET_NAME.contains(c))
        .take(MAX_SHEET_NAME)
        .collect()
}

/// Every format the workbook uses, built once. The two brand colours come from
/// [`crate::brand`] (TZ §8) and appear nowhere else in this file.
struct Palette {
    lockup: Format,
    title: Format,
    subtitle: Format,
    meta: Format,
    marking: Format,
    section: Format,
    head: Format,
    text: Format,
    marker: Format,
    count: Format,
    percent: Format,
    total_text: Format,
    total_marker: Format,
    total_count: Format,
    total_percent: Format,
    footnote: Format,
}

impl Palette {
    fn new() -> Self {
        let navy = Color::RGB(brand::NAVY_RGB);
        let orange = Color::RGB(brand::ORANGE_RGB);
        let white = Color::RGB(brand::WHITE_RGB);
        let muted = Color::RGB(brand::MUTED_RGB);

        let head = Format::new()
            .set_bold()
            .set_font_color(white)
            .set_background_color(navy)
            .set_border_bottom(FormatBorder::Medium)
            .set_border_bottom_color(orange)
            .set_text_wrap()
            .set_align(FormatAlign::VerticalCenter);
        let total = |format: Format| {
            format
                .set_bold()
                .set_border_top(FormatBorder::Thin)
                .set_border_top_color(orange)
        };

        Self {
            lockup: Format::new()
                .set_bold()
                .set_font_color(orange)
                .set_font_size(12),
            title: Format::new()
                .set_bold()
                .set_font_size(14)
                .set_font_color(white)
                .set_background_color(navy),
            subtitle: Format::new().set_font_color(navy),
            meta: Format::new().set_font_color(muted),
            marking: Format::new().set_bold().set_font_color(orange),
            section: Format::new()
                .set_bold()
                .set_font_size(12)
                .set_font_color(navy),
            head,
            text: Format::new(),
            marker: Format::new().set_italic().set_font_color(muted),
            count: Format::new().set_num_format("#,##0"),
            percent: Format::new().set_num_format("0.00%"),
            total_text: total(Format::new()),
            total_marker: total(Format::new().set_italic().set_font_color(muted)),
            total_count: total(Format::new().set_num_format("#,##0")),
            total_percent: total(Format::new().set_num_format("0.00%")),
            footnote: Format::new()
                .set_italic()
                .set_font_size(8)
                .set_font_color(muted),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::io::Cursor;

    use calamine::{DataType as _, Reader, Xlsx, open_workbook_from_rs};
    use compliance::{KPolicy, KThreshold};

    use super::{percent_as_fraction, render_xlsx, round_released, sheet_name};
    use crate::RenderOptions;
    use crate::doc::{Cell, Column, Label, Metric, ReportDoc, ReportSection, ReportTable, Row};
    use crate::locale::Locale;

    #[test]
    fn sheet_names_fit_excels_rules() {
        assert_eq!(sheet_name("3. Диапазоны"), "3. Диапазоны");
        assert_eq!(sheet_name("a/b:c*d?e[f]g"), "abcdefg");
        assert_eq!(sheet_name(&"я".repeat(40)).chars().count(), 31);
    }

    /// A share that is exact in decimal but not in binary - `0.1 + 0.2` - must
    /// become the number the JSON contract publishes, `0.3`, and never
    /// `0.30000000000000004`.
    #[test]
    fn released_fractions_carry_the_contracts_four_decimals() {
        assert_eq!(round_released(0.1 + 0.2), 0.3);
        assert_eq!(round_released(1.0 / 3.0), 0.3333);
        assert_eq!(round_released(2.0 / 3.0), 0.6667);
        assert_eq!(round_released(0.0), 0.0);
        assert_eq!(round_released(1.0), 1.0);

        // Four decimals *of the percentage*, which is the unit the contract
        // rounds: 76.4711 % is stored as the fraction 0.764711, not 0.7647.
        assert_eq!(percent_as_fraction(76.4711), 0.764711);
        assert_eq!(percent_as_fraction(76.471_149_9), 0.764711);
        assert_eq!(percent_as_fraction(30.000_000_000_000_004), 0.3);
        assert_eq!(percent_as_fraction(0.0), 0.0);
        assert_eq!(percent_as_fraction(100.0), 1.0);
    }

    /// The same property on the artefact itself: what the recipient's
    /// spreadsheet holds is the rounded value, and a count is still exact.
    #[test]
    fn the_written_cells_hold_the_rounded_value() {
        let policy = KPolicy::new(KThreshold::new(5).expect("test threshold is non-zero"));
        let strings = Locale::Ru.strings();
        let doc = ReportDoc {
            title: Label::phrase(strings.report_title),
            subtitle: Label::phrase(strings.report_subtitle),
            period: Label::academic_year(strings.period_academic_year, 2025),
            generated_note: Label::date(strings.generated_on, jiff::civil::date(2026, 9, 1)),
            sections: vec![ReportSection {
                title: Label::phrase(strings.section_buckets),
                short_title: Label::phrase(strings.sheet_buckets),
                table: ReportTable {
                    columns: vec![
                        Column::text(Label::phrase(strings.column_bucket)),
                        Column::numeric(Label::phrase(strings.column_checks)),
                        Column::numeric(Label::phrase(strings.column_share)),
                        Column::numeric(Label::phrase(strings.column_avg_originality)),
                    ],
                    rows: vec![Row::data(vec![
                        Cell::Label(Label::phrase(strings.bucket_ge95)),
                        Cell::Metric(Metric::count(&policy, 4_321, 4_321)),
                        Cell::Metric(Metric::share(&policy, 4_321, Some(0.1 + 0.2))),
                        Cell::Metric(Metric::percent(&policy, 4_321, Some(76.471_149_9))),
                    ])],
                },
                footnotes: Vec::new(),
            }],
            locale: Locale::Ru,
        };

        let bytes = render_xlsx(&doc, &RenderOptions::public()).expect("the workbook renders");
        let mut workbook: Xlsx<_> =
            open_workbook_from_rs(Cursor::new(bytes)).expect("the workbook reopens");
        let name = workbook
            .sheet_names()
            .first()
            .cloned()
            .expect("one worksheet per section");
        let range = workbook
            .worksheet_range(&name)
            .unwrap_or_else(|error| panic!("sheet `{name}`: {error}"));
        let numbers: Vec<f64> = range
            .used_cells()
            .filter_map(|(_, _, value)| value.get_float())
            .collect();

        assert!(
            numbers.contains(&0.3),
            "a share of 0.1 + 0.2 must be stored as 0.3: {numbers:?}"
        );
        assert!(
            numbers.contains(&0.764711),
            "a mean of 76.4711 % must be stored as 0.764711: {numbers:?}"
        );
        assert!(
            numbers.contains(&4_321.0),
            "a count must stay exact: {numbers:?}"
        );
    }
}
