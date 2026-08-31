//! Rendering gates for W3.5: what the two renderers may and may not put on the
//! page.
//!
//! The suppression assertions are the acceptance evidence for TZ §6.2 on the
//! *export* path - the k-anonymity guard on `/api/**` protects JSON responses,
//! and nothing protects a spreadsheet except this file.
//!
//! The PDF is inspected two ways on purpose. `RenderedPdf::text` is the text of
//! the laid-out document, i.e. exactly the glyph runs that were serialized into
//! the bytes, so scanning it *is* scanning the PDF. `lopdf` then re-parses the
//! bytes, which proves the file a reader will open is well-formed.

// `server/clippy.toml` declares `allow-expect-in-tests`, but that reaches
// `#[test]` functions and not the helpers below. These parse artefacts this file
// has just produced: a failure is a bug in the renderer, and the test must die
// loudly rather than silently skip the scan.
#![expect(
    clippy::expect_used,
    reason = "test helpers: a malformed artefact must abort the test"
)]

mod support;

use std::io::Cursor;

use calamine::{Data, Reader, Xlsx, open_workbook_from_rs};
use regex::Regex;
use reports::{Locale, RenderOptions, render_pdf, render_xlsx};
use support::{SECRET_COUNT, SECRET_PERCENT, suppressed_doc};

/// «Фамилия И. О.» - the shape a leaked person's name would take in a Russian
/// report (AGENTS.md invariant #1).
const FIO_PATTERN: &str = r"[А-ЯЁ][а-яё]+ [А-ЯЁ]\.\s?[А-ЯЁ]\.";

fn fio() -> Regex {
    Regex::new(FIO_PATTERN).expect("the ФИО pattern is a valid regex")
}

/// Every string a workbook holds: cell values plus the raw XML of every part, so
/// the scan reaches the page header and footer too - where the «Для служебного
/// пользования» marking lives and where a leak would be invisible to a cell
/// reader.
fn workbook_parts(bytes: &[u8]) -> Vec<(String, String)> {
    let mut archive = zip::ZipArchive::new(Cursor::new(bytes.to_vec()))
        .expect("a workbook is a readable zip archive");
    let mut parts = Vec::new();
    for index in 0..archive.len() {
        let mut entry = archive.by_index(index).expect("archive entry");
        let name = entry.name().to_owned();
        let mut body = String::new();
        if std::io::Read::read_to_string(&mut entry, &mut body).is_ok() {
            parts.push((name, body));
        }
    }
    assert!(
        parts.iter().any(|(name, _)| name.contains("sharedStrings")),
        "the shared-string table must be present, or this scan proves nothing"
    );
    parts
}

fn cell_values(bytes: &[u8]) -> Vec<Data> {
    let mut workbook: Xlsx<_> =
        open_workbook_from_rs(Cursor::new(bytes.to_vec())).expect("the workbook reopens");
    let mut values = Vec::new();
    for name in workbook.sheet_names() {
        let range = workbook
            .worksheet_range(&name)
            .unwrap_or_else(|error| panic!("sheet `{name}`: {error}"));
        values.extend(range.used_cells().map(|(_, _, value)| value.clone()));
    }
    values
}

#[test]
fn a_suppressed_cell_shows_the_marker_and_never_its_number() {
    let doc = suppressed_doc(Locale::Ru);
    let suppressed = doc.suppressed_cells().len();
    assert_eq!(
        suppressed, 4,
        "the fixture must actually suppress something"
    );
    let marker = Locale::Ru.strings().insufficient_data;

    // ── PDF ─────────────────────────────────────────────────────────────────
    let pdf = render_pdf(&doc, &RenderOptions::public()).expect("the PDF renders");
    assert_eq!(
        pdf.text.matches(marker).count(),
        suppressed,
        "every suppressed cell must print «{marker}»:\n{}",
        pdf.text
    );

    // ── XLSX ────────────────────────────────────────────────────────────────
    let xlsx = render_xlsx(&doc, &RenderOptions::public()).expect("the workbook renders");
    let values = cell_values(&xlsx);
    assert_eq!(
        values
            .iter()
            .filter(|value| matches!(value, Data::String(text) if text == marker))
            .count(),
        suppressed,
        "every suppressed cell must be the marker text, not a number"
    );
    // ── the withheld numbers appear nowhere, in either format ───────────────
    let count = SECRET_COUNT.to_string();
    let percent_ru = format!("{:.2}", SECRET_PERCENT).replace('.', ",");
    let percent_dot = format!("{SECRET_PERCENT:.2}");
    for needle in [count.as_str(), percent_ru.as_str(), percent_dot.as_str()] {
        assert!(
            !pdf.text.contains(needle),
            "the PDF leaked the suppressed value `{needle}`"
        );
        for (part, body) in workbook_parts(&xlsx) {
            assert!(
                !body.contains(needle),
                "the workbook leaked the suppressed value `{needle}` in {part}"
            );
        }
    }
    for value in &values {
        match value {
            Data::Float(number) => {
                #[expect(
                    clippy::cast_precision_loss,
                    reason = "the fixture constant is a small integer"
                )]
                let secret = SECRET_COUNT as f64;
                assert!(
                    (number - secret).abs() > f64::EPSILON,
                    "a suppressed count reached a numeric cell"
                );
                assert!(
                    (number - SECRET_PERCENT / 100.0).abs() > f64::EPSILON,
                    "a suppressed percentage reached a numeric cell"
                );
            }
            Data::Int(number) => assert_ne!(*number, SECRET_COUNT),
            _ => {}
        }
    }
}

#[test]
fn no_fio_shaped_string_reaches_either_format() {
    let pattern = fio();
    // A negative control: an assertion that can never fire proves nothing.
    assert!(
        pattern.is_match("Иванов И. И."),
        "the guard pattern must match an actual ФИО"
    );

    for locale in Locale::ALL {
        let doc = suppressed_doc(locale);
        let pdf = render_pdf(&doc, &RenderOptions::internal()).expect("the PDF renders");
        assert!(
            !pattern.is_match(&pdf.text),
            "{locale:?}: a ФИО-shaped string reached the PDF: {:?}",
            pattern.find(&pdf.text).map(|m| m.as_str())
        );

        let xlsx = render_xlsx(&doc, &RenderOptions::internal()).expect("the workbook renders");
        for (part, body) in workbook_parts(&xlsx) {
            assert!(
                !pattern.is_match(&body),
                "{locale:?}: a ФИО-shaped string reached {part}: {:?}",
                pattern.find(&body).map(|m| m.as_str())
            );
        }
    }
}

#[test]
fn the_pdf_is_a_well_formed_document() {
    let doc = suppressed_doc(Locale::Ru);
    let pdf = render_pdf(&doc, &RenderOptions::public()).expect("the PDF renders");

    assert!(pdf.bytes.starts_with(b"%PDF-"), "missing the PDF header");
    let tail = &pdf.bytes[pdf.bytes.len().saturating_sub(64)..];
    assert!(
        tail.windows(5).any(|window| window == b"%%EOF"),
        "missing the %%EOF trailer"
    );

    let parsed = lopdf::Document::load_mem(&pdf.bytes).expect("a PDF reader parses the file");
    assert_eq!(
        parsed.get_pages().len(),
        pdf.pages,
        "the parsed page count must match the laid-out one"
    );
    assert!(pdf.pages >= 1);
}

/// Determinism is what makes the snapshot content hash meaningful: the same
/// document must always hash to the same value.
#[test]
fn the_pdf_is_byte_stable_across_runs() {
    let doc = suppressed_doc(Locale::Ru);
    let first = render_pdf(&doc, &RenderOptions::public()).expect("the PDF renders");
    let second = render_pdf(&doc, &RenderOptions::public()).expect("the PDF renders again");
    assert_eq!(
        first.bytes, second.bytes,
        "two renders of the same document differ - something reads a clock"
    );

    let book = render_xlsx(&doc, &RenderOptions::public()).expect("the workbook renders");
    let again = render_xlsx(&doc, &RenderOptions::public()).expect("the workbook renders again");
    assert_eq!(book, again, "the workbook is not reproducible");
}

/// R4 again, this time on real output: the Kazakh template must lay out with no
/// `.notdef` glyph anywhere.
#[test]
fn the_kazakh_report_renders_without_tofu() {
    for locale in Locale::ALL {
        let doc = suppressed_doc(locale);
        let pdf = render_pdf(&doc, &RenderOptions::internal()).expect("the PDF renders");
        assert!(
            pdf.missing_glyphs.is_empty(),
            "{locale:?}: the bundled fonts cannot draw {:?}",
            pdf.missing_glyphs
        );
    }

    let kk =
        render_pdf(&suppressed_doc(Locale::Kk), &RenderOptions::public()).expect("the PDF renders");
    for phrase in [
        Locale::Kk.strings().insufficient_data,
        Locale::Kk.strings().section_faculties,
    ] {
        assert!(
            kk.text.contains(phrase),
            "the Kazakh report is missing `{phrase}`"
        );
    }
}

/// TZ §4.4 - an internal export is marked, a public one is not.
#[test]
fn the_service_marking_appears_only_on_internal_exports() {
    let doc = suppressed_doc(Locale::Ru);
    let marking = Locale::Ru.strings().internal_marking;

    let internal = render_pdf(&doc, &RenderOptions::internal()).expect("the PDF renders");
    assert!(
        internal.text.contains(marking),
        "an internal export must carry «{marking}»"
    );
    let public = render_pdf(&doc, &RenderOptions::public()).expect("the PDF renders");
    assert!(
        !public.text.contains(marking),
        "a published report must not be marked for internal use"
    );

    let internal = render_xlsx(&doc, &RenderOptions::internal()).expect("the workbook renders");
    assert!(
        workbook_parts(&internal)
            .iter()
            .any(|(_, body)| body.contains(marking)),
        "the workbook must carry the marking in a cell and in the print header"
    );
    let public = render_xlsx(&doc, &RenderOptions::public()).expect("the workbook renders");
    assert!(
        workbook_parts(&public)
            .iter()
            .all(|(_, body)| !body.contains(marking)),
        "a published workbook must not be marked for internal use"
    );
}

#[test]
fn one_worksheet_per_section_named_after_it() {
    let doc = suppressed_doc(Locale::Ru);
    let xlsx = render_xlsx(&doc, &RenderOptions::public()).expect("the workbook renders");
    let workbook: Xlsx<_> = open_workbook_from_rs(Cursor::new(xlsx)).expect("the workbook reopens");
    let names = workbook.sheet_names();
    assert_eq!(names.len(), doc.sections.len());
    assert_eq!(names[0], doc.sections[0].short_title.render(doc.locale));
}

#[test]
fn a_table_whose_rows_do_not_match_its_columns_is_refused() {
    let mut doc = suppressed_doc(Locale::Ru);
    doc.sections[0].table.rows[0].cells.pop();
    assert!(!doc.sections[0].table.is_rectangular());

    assert!(matches!(
        render_pdf(&doc, &RenderOptions::public()),
        Err(reports::ReportError::MalformedTable)
    ));
    assert!(matches!(
        render_xlsx(&doc, &RenderOptions::public()),
        Err(reports::ReportError::MalformedTable)
    ));
}

/// What the model says a section holds is what the PDF shows.
///
/// Only headings, column headers and cells are checked: a worksheet tab name
/// exists for Excel alone, and a long footnote is line-broken into several text
/// runs, so neither is a `contains` away from the laid-out text.
#[test]
fn the_rendered_cells_are_exactly_what_the_model_promised() {
    for locale in Locale::ALL {
        let doc = suppressed_doc(locale);
        let pdf = render_pdf(&doc, &RenderOptions::public()).expect("the PDF renders");

        let mut expected = vec![doc.title.render(locale), doc.period.render(locale)];
        for section in &doc.sections {
            expected.push(section.title.render(locale));
            expected.extend(
                section
                    .table
                    .columns
                    .iter()
                    .map(|column| column.header.render(locale)),
            );
            expected.extend(
                section
                    .table
                    .rows
                    .iter()
                    .flat_map(|row| row.cells.iter().map(|cell| cell.render(locale))),
            );
        }

        for string in expected {
            assert!(
                pdf.text.contains(&string),
                "{locale:?}: the model promised `{string}` but the PDF does not show it"
            );
        }
    }
}
