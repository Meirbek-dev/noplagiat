//! **Acceptance evidence for TZ §10.9 / §4.5** - every cell of the seven
//! Приложение-1 tables reproduces `fixtures/expected.json`.
//!
//! `fixtures/expected.ts` is an independent brute-force reducer: no SQL, nothing
//! imported from `server/` (fixtures/README.md "Independence"). Comparing the
//! rendered report against it therefore catches a disagreement between the
//! report builder and the warehouse, not a shared mistake.
//!
//! Derived figures - the share of rechecks, the share of each originality band,
//! the mean and peak of the monthly reviewer counts - are **recomputed here**
//! from the published primitives rather than read out of a matching field, so
//! the arithmetic in `annual.rs` is checked rather than echoed.
//!
//! `expected.json` pins exactly one academic-year scenario,
//! `academic-year-2025-2026`; there is no 2024/25 row to compare against, so
//! that year is not asserted here.

mod support;

use compliance::KPolicy;
use db::Pool;
use regex::Regex;
use reports::{
    Cell, Locale, Metric, MetricValue, RenderOptions, ReportDoc, render_pdf, render_xlsx,
};
use sqlx::PgPool;
use support::{MEAN_TOLERANCE, as_f64, as_i64, as_str, assert_close};

/// Section indices, in the order the printed form lists its tables (TZ §4.5).
const SUMMARY: usize = 0;
const WORK_TYPES: usize = 1;
const BUCKETS: usize = 2;
const FACULTIES: usize = 3;
const RECHECKS: usize = 4;
const ESCALATIONS: usize = 5;
const USAGE: usize = 6;

/// Counts must match exactly; a share recomputed from two exact counts is a
/// division of integers and matches to within floating-point noise.
const SHARE_TOLERANCE: f64 = 1e-12;

fn metric(doc: &ReportDoc, section: usize, row: usize, column: usize) -> &Metric {
    doc.sections[section].table.rows[row].cells[column]
        .metric()
        .unwrap_or_else(|| panic!("section {section} row {row} column {column} is not a metric"))
}

fn label(doc: &ReportDoc, section: usize, row: usize, column: usize) -> String {
    match &doc.sections[section].table.rows[row].cells[column] {
        Cell::Label(label) => label.render(doc.locale),
        Cell::Metric(_) => panic!("section {section} row {row} column {column} is not a label"),
    }
}

fn visible(doc: &ReportDoc, section: usize, row: usize, column: usize) -> MetricValue {
    metric(doc, section, row, column)
        .visible()
        .unwrap_or_else(|| panic!("section {section} row {row} column {column} is suppressed"))
}

fn count_of(doc: &ReportDoc, section: usize, row: usize, column: usize) -> i64 {
    match visible(doc, section, row, column) {
        MetricValue::Count(value) | MetricValue::Seconds(value) => value,
        other => panic!("section {section} row {row} column {column} holds {other:?}, not a count"),
    }
}

fn percent_of(doc: &ReportDoc, section: usize, row: usize, column: usize) -> f64 {
    match visible(doc, section, row, column) {
        MetricValue::Percent(value) => value,
        other => {
            panic!("section {section} row {row} column {column} holds {other:?}, not a percent")
        }
    }
}

fn share_of(doc: &ReportDoc, section: usize, row: usize, column: usize) -> f64 {
    match visible(doc, section, row, column) {
        MetricValue::Share(value) => value,
        other => panic!("section {section} row {row} column {column} holds {other:?}, not a share"),
    }
}

/// One `#[sqlx::test]` database serves all seven tables: loading 60 000 fact
/// rows takes seconds, and a test per table would pay that cost seven times.
#[sqlx::test(migrations = "../../migrations")]
async fn the_seven_tables_reproduce_expected_json(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    support::load_warehouse(&pool).await?;
    let expected = support::expected_json();
    let want = support::scenario(&expected, "academic-year-2025-2026");
    assert_eq!(
        as_str(&want["filters"]["from"], "scenario period"),
        "2025-09-01",
        "the scenario must be the academic year this test names"
    );

    let doc = reports::annual_report(
        &pool,
        domain::AcademicYear(2025),
        Locale::Ru,
        KPolicy::default(),
        jiff::civil::date(2026, 9, 1),
    )
    .await
    .expect("the annual report builds");

    assert_eq!(
        doc.sections.len(),
        7,
        "the Приложение-1 form has seven tables"
    );
    for section in &doc.sections {
        assert!(
            section.table.is_rectangular(),
            "every row must match the column count"
        );
    }

    // ── 1. Общие показатели ─────────────────────────────────────────────────
    let summary = &want["summary"];
    let checks = as_i64(&summary["checks"], "summary.checks");
    assert_eq!(count_of(&doc, SUMMARY, 0, 1), checks);
    assert_close(
        "summary.avg_originality",
        percent_of(&doc, SUMMARY, 1, 1),
        as_f64(&summary["avg_originality"], "avg"),
        MEAN_TOLERANCE,
    );
    // Recomputed, not read: the share is `below_threshold ÷ checks`.
    #[expect(
        clippy::cast_precision_loss,
        reason = "fixture counts are far inside f64's exact integer range"
    )]
    let recomputed_below = as_i64(&summary["below_threshold"], "below") as f64 / checks as f64;
    assert_close(
        "summary.below_threshold_share",
        share_of(&doc, SUMMARY, 2, 1),
        recomputed_below,
        SHARE_TOLERANCE,
    );
    assert_close(
        "summary.below_threshold_share vs the fixture",
        share_of(&doc, SUMMARY, 2, 1),
        as_f64(&summary["below_threshold_share"], "share"),
        MEAN_TOLERANCE,
    );
    assert_eq!(
        count_of(&doc, SUMMARY, 3, 1),
        as_i64(&want["escalations"]["checks_escalated"], "escalated")
    );
    // The fixture seeds no `submission_totals`, so the coverage row is omitted
    // and said to be omitted (TZ §4.2 §1 «при наличии данных»).
    assert_eq!(doc.sections[SUMMARY].table.rows.len(), 4);
    assert!(
        doc.sections[SUMMARY]
            .footnotes
            .iter()
            .any(|note| note.render(Locale::Ru) == Locale::Ru.strings().note_coverage_missing),
        "the omission must be stated, not silent"
    );

    // ── 2. Распределение по типам работ ─────────────────────────────────────
    let work_types = want["work_types"]
        .as_array()
        .expect("work_types is an array");
    let section = &doc.sections[WORK_TYPES];
    assert_eq!(
        section.table.rows.len(),
        work_types.len() + 1,
        "one row per work type plus «Итого»"
    );
    let mut work_type_checks = 0_i64;
    for (index, row) in work_types.iter().enumerate() {
        let code = as_str(&row["code"], "work type code");
        let context = format!("work_type {code}");
        assert_eq!(
            label(&doc, WORK_TYPES, index, 0),
            Locale::Ru
                .strings()
                .work_type(code)
                .unwrap_or_else(|| panic!("{code} has no Russian name")),
            "{context}: label"
        );
        let got = count_of(&doc, WORK_TYPES, index, 1);
        assert_eq!(got, as_i64(&row["checks"], &context), "{context}: checks");
        work_type_checks += got;
        assert_close(
            &context,
            percent_of(&doc, WORK_TYPES, index, 2),
            as_f64(&row["avg_originality"], &context),
            MEAN_TOLERANCE,
        );
    }
    let total = work_types.len();
    assert_eq!(
        count_of(&doc, WORK_TYPES, total, 1),
        checks,
        "the «Итого» row must equal the headline count"
    );
    assert_eq!(
        work_type_checks, checks,
        "the work-type rows must partition the period exactly"
    );

    // ── 3. Распределение по диапазонам оригинальности ───────────────────────
    let histogram = &want["histogram"];
    let bands = ["lt50", "b50_70", "b70_85", "b85_95", "ge95"];
    let mut band_total = 0_i64;
    for (index, key) in bands.into_iter().enumerate() {
        let got = count_of(&doc, BUCKETS, index, 1);
        assert_eq!(got, as_i64(&histogram[key], key), "histogram.{key}");
        band_total += got;
    }
    assert_eq!(band_total, checks, "the bands must partition the period");
    assert_eq!(count_of(&doc, BUCKETS, bands.len(), 1), checks);
    for (index, key) in bands.into_iter().enumerate() {
        #[expect(
            clippy::cast_precision_loss,
            reason = "fixture counts are far inside f64's exact integer range"
        )]
        let recomputed = as_i64(&histogram[key], key) as f64 / checks as f64;
        assert_close(
            &format!("histogram share {key}"),
            share_of(&doc, BUCKETS, index, 2),
            recomputed,
            SHARE_TOLERANCE,
        );
    }
    assert_close(
        "histogram total share",
        share_of(&doc, BUCKETS, bands.len(), 2),
        1.0,
        SHARE_TOLERANCE,
    );

    // ── 4. Распределение по факультетам ─────────────────────────────────────
    // `expected.json` publishes department grain; the annual report publishes
    // faculty grain, so the reference figures are rolled up here - a weighted
    // mean over the departments, which is what a mean over the faculty's rows is.
    let mut faculties: Vec<(String, i64, f64)> = Vec::new();
    for unit in want["units"].as_array().expect("units is an array") {
        let code = as_str(&unit["faculty"], "faculty").to_owned();
        let unit_checks = as_i64(&unit["checks"], "unit checks");
        let unit_mean = as_f64(&unit["avg_originality"], "unit mean");
        #[expect(
            clippy::cast_precision_loss,
            reason = "fixture counts are far inside f64's exact integer range"
        )]
        let weighted = unit_mean * unit_checks as f64;
        match faculties.iter_mut().find(|(seen, _, _)| *seen == code) {
            Some(entry) => {
                entry.1 += unit_checks;
                entry.2 += weighted;
            }
            None => faculties.push((code, unit_checks, weighted)),
        }
    }
    faculties.sort_by(|left, right| left.0.cmp(&right.0));

    let section = &doc.sections[FACULTIES];
    assert_eq!(section.table.rows.len(), faculties.len() + 1);
    let mut faculty_checks = 0_i64;
    for (index, (code, unit_checks, weighted)) in faculties.iter().enumerate() {
        let context = format!("faculty {code}");
        let expected_label = Locale::Ru
            .strings()
            .unit(code)
            .map_or_else(|| code.clone(), ToOwned::to_owned);
        assert_eq!(
            label(&doc, FACULTIES, index, 0),
            expected_label,
            "{context}"
        );
        let got = count_of(&doc, FACULTIES, index, 1);
        assert_eq!(got, *unit_checks, "{context}: checks");
        faculty_checks += got;
        #[expect(
            clippy::cast_precision_loss,
            reason = "fixture counts are far inside f64's exact integer range"
        )]
        let rolled_up = weighted / *unit_checks as f64;
        assert_close(
            &context,
            percent_of(&doc, FACULTIES, index, 2),
            rolled_up,
            MEAN_TOLERANCE,
        );
    }
    assert_eq!(
        faculty_checks, checks,
        "the faculties must partition the period"
    );
    assert_eq!(count_of(&doc, FACULTIES, faculties.len(), 1), checks);

    // ── 5. Повторные проверки ───────────────────────────────────────────────
    let rechecks = &want["rechecks"];
    let works_total = as_i64(&rechecks["works_total"], "works_total");
    let works_rechecked = as_i64(&rechecks["works_rechecked"], "works_rechecked");
    let improved = as_i64(&rechecks["improved"], "improved");
    assert_eq!(count_of(&doc, RECHECKS, 0, 1), works_total);
    assert_eq!(count_of(&doc, RECHECKS, 1, 1), works_rechecked);
    #[expect(
        clippy::cast_precision_loss,
        reason = "fixture counts are far inside f64's exact integer range"
    )]
    let (recheck_share, improved_share) = (
        works_rechecked as f64 / works_total as f64,
        improved as f64 / works_rechecked as f64,
    );
    assert_close(
        "recheck share",
        share_of(&doc, RECHECKS, 2, 1),
        recheck_share,
        SHARE_TOLERANCE,
    );
    assert_close(
        "improved share",
        share_of(&doc, RECHECKS, 3, 1),
        improved_share,
        SHARE_TOLERANCE,
    );

    // ── 6. Эскалации ────────────────────────────────────────────────────────
    assert_eq!(
        count_of(&doc, ESCALATIONS, 0, 1),
        as_i64(&want["escalations"]["checks_escalated"], "escalated")
    );
    assert_eq!(
        visible(&doc, ESCALATIONS, 0, 2),
        MetricValue::Absent,
        "a derived escalation flag has no «рассмотрено» counterpart"
    );
    assert_eq!(
        doc.sections[ESCALATIONS].table.rows.len(),
        1,
        "the fixture seeds no Ethics Council rows"
    );

    // ── 7. Использование системы ────────────────────────────────────────────
    let usage = want["usage"].as_array().expect("usage is an array");
    let reviewers: Vec<i64> = usage
        .iter()
        .map(|point| as_i64(&point["active_reviewers"], "active_reviewers"))
        .collect();
    let months = i64::try_from(reviewers.len()).unwrap_or_default();
    let mean = (reviewers.iter().sum::<i64>() + months / 2) / months;
    let peak = reviewers.iter().copied().max().unwrap_or_default();
    assert_eq!(count_of(&doc, USAGE, 0, 1), mean, "mean monthly reviewers");
    assert_eq!(count_of(&doc, USAGE, 1, 1), peak, "peak monthly reviewers");
    assert_eq!(
        visible(&doc, USAGE, 2, 1),
        MetricValue::Absent,
        "«нет данных» until `usage_stats` is filled in (ADR-008 §9)"
    );
    assert!(
        doc.sections[USAGE]
            .footnotes
            .iter()
            .any(|note| note.render(Locale::Ru) == Locale::Ru.strings().note_no_duration),
        "the absence must be stated"
    );

    // ── the rendered artefacts ──────────────────────────────────────────────
    let pdf = render_pdf(&doc, &RenderOptions::public()).expect("the PDF renders");
    let xlsx = render_xlsx(&doc, &RenderOptions::public()).expect("the workbook renders");
    assert!(pdf.bytes.starts_with(b"%PDF-"));
    assert!(pdf.missing_glyphs.is_empty(), "{:?}", pdf.missing_glyphs);
    assert!(!xlsx.is_empty());

    // The anti-PII guard, on the real report rather than on a fixture document.
    let fio = Regex::new(r"[А-ЯЁ][а-яё]+ [А-ЯЁ]\.\s?[А-ЯЁ]\.").expect("valid regex");
    assert!(
        !fio.is_match(&pdf.text),
        "a ФИО-shaped string reached the annual report: {:?}",
        fio.find(&pdf.text).map(|found| found.as_str())
    );

    Ok(())
}

/// Raising `k` above a faculty's size must hide that faculty - the same rule the
/// dashboard applies, on the published annual report.
#[sqlx::test(migrations = "../../migrations")]
async fn a_stricter_policy_suppresses_the_report(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    support::load_warehouse(&pool).await?;

    let threshold = compliance::KThreshold::new(1_000_000).expect("non-zero");
    let doc = reports::annual_report(
        &pool,
        domain::AcademicYear(2025),
        Locale::Ru,
        KPolicy::new(threshold),
        jiff::civil::date(2026, 9, 1),
    )
    .await
    .expect("the annual report builds");

    let total_cells: usize = doc
        .sections
        .iter()
        .flat_map(|section| &section.table.rows)
        .flat_map(|row| &row.cells)
        .filter(|cell| cell.metric().is_some())
        .count();
    assert_eq!(
        doc.suppressed_cells().len(),
        total_cells,
        "at k = 1 000 000 every group is small, so every metric must be hidden"
    );

    let pdf = render_pdf(&doc, &RenderOptions::public()).expect("the PDF renders");
    assert!(
        pdf.text.contains(Locale::Ru.strings().insufficient_data),
        "a fully suppressed report must say so"
    );
    // The headline figure of the unsuppressed report, formatted the way this
    // locale would print it, must appear nowhere.
    for leaked in ["20\u{a0}800", "20800", "76,47"] {
        assert!(
            !pdf.text.contains(leaked),
            "a suppressed report still printed `{leaked}`"
        );
    }

    Ok(())
}
