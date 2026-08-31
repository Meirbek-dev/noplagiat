//! The per-row pipeline: one untrusted CSV record in, one PII-free
//! [`ParsedRow`] (or a typed [`RowRejection`]) out.
//!
//! Everything nominative - title, authors, reviewer name, reviewer e-mail -
//! exists only as a borrow into the `csv::StringRecord` inside
//! [`parse_row`]. It is consumed by [`crate::refs::Pepper`] and by the rule
//! matchers and is gone when the function returns: [`ParsedRow`] has no field
//! that could hold it (ADR-008 §2, AGENTS.md invariant #1).

use domain::{AcademicYear, InitiatorRole, OriginalityPct, ReviewerRef, SourceCheckId, WorkRef};

use crate::error::{RejectionKind, RowRejection};
use crate::norm::{norm, parse_yes};
use crate::refs::Pepper;
use crate::rules::RuleSet;
use crate::source_csv::{STATUS_DELETED, STATUS_NOT_DELETED, col};

/// Fixed offset the naive export timestamps are read at (ADR-008 §1). A
/// documented approximation: the monthly grain absorbs it.
pub const SOURCE_OFFSET_HOURS: i8 = 5;

/// A validated source row, ready for attempt grouping and upsert.
///
/// Percentages are integer hundredths so no float ever decides which histogram
/// bucket a check lands in.
#[derive(Debug, Clone)]
pub struct ParsedRow {
    pub source_check_id: SourceCheckId,
    pub checked_at: jiff::Timestamp,
    pub academic_year: AcademicYear,
    pub work_ref: WorkRef,
    pub reviewer_ref: ReviewerRef,
    pub work_type_id: i64,
    pub faculty_id: i64,
    pub department_id: i64,
    pub originality: OriginalityPct,
    pub self_citation_hundredths: Option<i32>,
    pub citation_hundredths: Option<i32>,
    pub match_hundredths: Option<i32>,
    pub ai_content_hundredths: Option<i32>,
    pub suspicious: bool,
    pub suspicion_cleared: bool,
    pub deleted: bool,
    pub initiator: InitiatorRole,
}

/// What one record turned into.
#[derive(Debug)]
pub enum RowOutcome {
    Row(Box<ParsedRow>),
    /// «Удален» with an unparseable identifier: counted in
    /// `rows_skipped_deleted`, never guessed into a fact (ADR-008 §1).
    DeletedWithoutIdentifier,
    Rejected(RowRejection),
}

/// Reduce one record to a [`ParsedRow`].
///
/// Validation order mirrors ADR-008 §1 and `fixtures/expected.ts`: shape, then
/// «Статус», then the report link. A shifted row therefore reports
/// `column_shifted` rather than the `unparseable_report_link` its garbled link
/// column would otherwise suggest.
pub fn parse_row(
    row_index: u64,
    record: &csv::StringRecord,
    pepper: &Pepper,
    rules: &RuleSet,
) -> RowOutcome {
    if record.len() != crate::source_csv::DOCUMENTS_HEADER.len() {
        return RowOutcome::Rejected(RowRejection::new(
            row_index,
            RejectionKind::ColumnShifted,
            None,
        ));
    }

    let field = |index: usize| record.get(index).unwrap_or_default();

    // «Статус» is the shift detector: in the observed defect the report URL
    // lands here, so anything that is not one of the two contract values means
    // the record is misaligned and must never be guessed (PLAN §1.4).
    let deleted = match field(col::STATUS).trim() {
        STATUS_NOT_DELETED => false,
        STATUS_DELETED => true,
        _ => {
            return RowOutcome::Rejected(RowRejection::at_column(
                row_index,
                RejectionKind::ColumnShifted,
                col::STATUS,
            ));
        }
    };

    let reject = |kind: RejectionKind, column: usize| -> RowOutcome {
        if deleted {
            // A deleted row cannot be surfaced as a rejection without
            // double-counting it: the sidecar counts every «Удален» row in
            // `rows_deleted`. It is counted there and dropped.
            RowOutcome::DeletedWithoutIdentifier
        } else {
            RowOutcome::Rejected(RowRejection::at_column(row_index, kind, column))
        }
    };

    let Some((user_id, report_id)) = parse_report_link(field(col::REPORT_LINK)) else {
        return reject(RejectionKind::UnparseableReportLink, col::REPORT_LINK);
    };
    let Ok(source_check_id) = SourceCheckId::new(format!("{user_id}:{report_id}")) else {
        return reject(RejectionKind::InvalidCheckId, col::REPORT_LINK);
    };

    let Some(local) = parse_stamp(field(col::CHECKED_AT)) else {
        return reject(RejectionKind::InvalidTimestamp, col::CHECKED_AT);
    };
    let Ok(checked_at) = jiff::tz::Offset::constant(SOURCE_OFFSET_HOURS).to_timestamp(local) else {
        return reject(RejectionKind::InvalidTimestamp, col::CHECKED_AT);
    };

    let originality = match parse_percentage(field(col::ORIGINALITY)) {
        Ok(Some(value)) => value,
        Ok(None) | Err(_) => return reject(RejectionKind::InvalidPercentage, col::ORIGINALITY),
    };

    let mut optional = [None; 4];
    for (slot, column) in optional.iter_mut().zip([
        col::SELF_CITATION,
        col::CITATION,
        col::MATCH,
        col::AI_CONTENT,
    ]) {
        // The 2021/22–2024/25 vendor exports print a bare dash in optional
        // metric columns that have no value («ИИ-контент» is `-` for every
        // pre-AI-detector row). A dash is absence, not a malformed number -
        // but only here: a dash in «Оригинальность» stays a rejection.
        //
        // Two forms, not three: a third alternative here used to be a second
        // copy of U+002D, which the compiler reads as unreachable. Across every
        // export in `stats/` the only whole-field dash is U+002D, all of it in
        // «ИИ-контент»; U+2013 is kept because it costs nothing and a vendor
        // that changes typography would otherwise reject a year of rows. Add a
        // form when an export shows one, not on the guess that it might.
        let raw = field(column);
        if matches!(raw.trim(), "-" | "–") {
            continue;
        }
        match parse_percentage(raw) {
            Ok(value) => *slot = value.map(|pct| i32::from(pct.hundredths())),
            Err(_) => return reject(RejectionKind::InvalidPercentage, column),
        }
    }

    // ── The only scope where plaintext exists ────────────────────────────────
    let work_ref = pepper.work_ref(field(col::TITLE), field(col::AUTHORS));
    let reviewer_ref = pepper.reviewer_ref(field(col::REVIEWER_EMAIL));
    let work_type_id = rules.work_type(&norm(field(col::TITLE)));
    let initiator = rules.initiator(&norm(field(col::REVIEWER_EMAIL)));
    // ── …and here it ends: nothing below reads `record` again ────────────────

    let (faculty_id, department_id) = rules.unit(&reviewer_ref);

    RowOutcome::Row(Box::new(ParsedRow {
        source_check_id,
        checked_at,
        academic_year: AcademicYear::from_date(local.date()),
        work_ref,
        reviewer_ref,
        work_type_id,
        faculty_id,
        department_id,
        originality,
        self_citation_hundredths: optional[0],
        citation_hundredths: optional[1],
        match_hundredths: optional[2],
        ai_content_hundredths: optional[3],
        suspicious: parse_yes(field(col::SUSPICIOUS)),
        suspicion_cleared: parse_yes(field(col::SUSPICION_CLEARED)),
        deleted,
        initiator,
    }))
}

/// `…/report/full/{reportId}?userId={userId}` → `(userId, reportId)`.
///
/// Both parts must be non-empty digit runs; there is no fallback and no guess
/// (ADR-008 §1).
#[must_use]
pub fn parse_report_link(link: &str) -> Option<(&str, &str)> {
    const MARKER: &str = "/report/full/";
    const USER: &str = "?userId=";

    let after = link.find(MARKER).map(|at| &link[at + MARKER.len()..])?;
    let report_len = after.bytes().take_while(u8::is_ascii_digit).count();
    if report_len == 0 {
        return None;
    }
    let (report_id, rest) = after.split_at(report_len);

    let rest = rest.strip_prefix(USER)?;
    let user_len = rest.bytes().take_while(u8::is_ascii_digit).count();
    if user_len == 0 {
        return None;
    }
    Some((&rest[..user_len], report_id))
}

/// `dd.MM.yyyy HH:mm` → a civil datetime. No offset is applied here.
#[must_use]
pub fn parse_stamp(value: &str) -> Option<jiff::civil::DateTime> {
    let value = value.trim();
    let (date, time) = value.split_once(' ')?;
    let mut date = date.split('.');
    let day: i8 = date.next()?.parse().ok()?;
    let month: i8 = date.next()?.parse().ok()?;
    let year: i16 = date.next()?.parse().ok()?;
    if date.next().is_some() {
        return None;
    }
    let (hour, minute) = time.split_once(':')?;
    let hour: i8 = hour.parse().ok()?;
    let minute: i8 = minute.parse().ok()?;
    jiff::civil::DateTime::new(year, month, day, hour, minute, 0, 0).ok()
}

/// Why a numeric field could not be read.
#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
pub enum DecimalError {
    /// Not a decimal number, or more fractional digits than the column holds.
    #[error("not a decimal number with at most {scale} fractional digit(s)")]
    Malformed { scale: u32 },
    /// Outside `0,00`..`100,00`.
    #[error("percentage outside 0,00..100,00")]
    OutOfRange,
}

/// A decimal-comma percentage → hundredths, range-checked against 0..=100.
///
/// An empty field is a genuine NULL (the extra columns of PLAN §1.1 are often
/// blank), not a zero.
pub fn parse_percentage(value: &str) -> Result<Option<OriginalityPct>, DecimalError> {
    let Some(hundredths) = parse_decimal(value, 2)? else {
        return Ok(None);
    };
    u16::try_from(hundredths)
        .ok()
        .and_then(|value| OriginalityPct::from_hundredths(value).ok())
        .map(Some)
        .ok_or(DecimalError::OutOfRange)
}

/// A decimal-comma (or decimal-point) number → an integer scaled by `10^scale`.
///
/// Rejects more fractional digits than `scale` rather than rounding: silently
/// dropping a digit would make two different source values compare equal.
pub fn parse_decimal(value: &str, scale: u32) -> Result<Option<i32>, DecimalError> {
    let malformed = DecimalError::Malformed { scale };
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }
    let (negative, digits) = match value.strip_prefix('-') {
        Some(rest) => (true, rest),
        None => (false, value.strip_prefix('+').unwrap_or(value)),
    };

    let (whole, fraction) = match digits.split_once([',', '.']) {
        Some((whole, fraction)) => (whole, fraction),
        None => (digits, ""),
    };
    if whole.is_empty() && fraction.is_empty() {
        return Err(malformed);
    }
    if !whole.bytes().all(|b| b.is_ascii_digit()) || !fraction.bytes().all(|b| b.is_ascii_digit()) {
        return Err(malformed);
    }
    if fraction.len() > scale as usize {
        return Err(malformed);
    }

    let factor = 10_i64.pow(scale);
    let whole: i64 = if whole.is_empty() {
        0
    } else {
        whole.parse().map_err(|_| malformed)?
    };
    let mut fractional: i64 = if fraction.is_empty() {
        0
    } else {
        fraction.parse().map_err(|_| malformed)?
    };
    for _ in 0..(scale as usize - fraction.len()) {
        fractional *= 10;
    }

    let scaled = whole
        .checked_mul(factor)
        .ok_or(malformed)?
        .checked_add(fractional)
        .ok_or(malformed)?;
    let scaled = if negative { -scaled } else { scaled };
    i32::try_from(scaled).map(Some).map_err(|_| malformed)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn report_links_yield_user_and_report_ids() {
        assert_eq!(
            parse_report_link("https://noplagiat.tou.edu.kz/report/full/2025016224?userId=20087"),
            Some(("20087", "2025016224"))
        );
        // Trailing parameters do not break the parse.
        assert_eq!(
            parse_report_link("/report/full/1?userId=2&x=3"),
            Some(("2", "1"))
        );
    }

    #[test]
    fn an_unparseable_link_is_never_guessed() {
        // Exactly the two shapes fixtures/generate.ts injects.
        assert_eq!(parse_report_link(""), None);
        assert_eq!(
            parse_report_link("https://noplagiat.tou.edu.kz/report/full/?userId="),
            None
        );
        assert_eq!(parse_report_link("/report/full/12?userId="), None);
        assert_eq!(parse_report_link("/report/full/12"), None);
        assert_eq!(parse_report_link("/report/full/abc?userId=1"), None);
        assert_eq!(parse_report_link("0,99"), None);
    }

    #[test]
    fn timestamps_use_the_russian_source_format() {
        let parsed = parse_stamp("01.09.2025 00:36").unwrap();
        assert_eq!(parsed.year(), 2025);
        assert_eq!(parsed.month(), 9);
        assert_eq!(parsed.day(), 1);
        assert_eq!(parsed.hour(), 0);
        assert_eq!(parsed.minute(), 36);
        assert_eq!(parsed.second(), 0);
        assert_eq!(parse_stamp(" 31.12.2024 23:59 ").unwrap().day(), 31);
    }

    #[test]
    fn malformed_timestamps_are_rejected() {
        assert!(parse_stamp("2025-09-01 00:36").is_none());
        assert!(parse_stamp("01.09.2025").is_none());
        assert!(parse_stamp("32.09.2025 00:00").is_none());
        assert!(parse_stamp("01.13.2025 00:00").is_none());
        assert!(parse_stamp("01.09.2025 24:00").is_none());
        assert!(parse_stamp("01.09.2025.1 00:00").is_none());
        assert!(parse_stamp("").is_none());
    }

    #[test]
    fn the_fixed_offset_is_plus_five() {
        let local = parse_stamp("01.09.2025 05:00").unwrap();
        let stamp = jiff::tz::Offset::constant(SOURCE_OFFSET_HOURS)
            .to_timestamp(local)
            .unwrap();
        assert_eq!(stamp.as_second(), 1_756_684_800, "2025-09-01T00:00:00Z");
    }

    #[test]
    fn decimal_commas_become_exact_hundredths() {
        let hundredths = |s: &str| parse_percentage(s).unwrap().map(|p| p.hundredths());
        assert_eq!(hundredths("62,48"), Some(6248));
        assert_eq!(hundredths("0,00"), Some(0));
        assert_eq!(hundredths("100,00"), Some(10_000));
        assert_eq!(hundredths("7"), Some(700));
        assert_eq!(hundredths("7,5"), Some(750));
        assert_eq!(hundredths(" 95,69 "), Some(9569));
        // A blank extra column is NULL, not zero (PLAN §1.1).
        assert_eq!(hundredths(""), None);
    }

    #[test]
    fn out_of_range_and_ambiguous_percentages_are_rejected() {
        assert!(parse_percentage("100,01").is_err());
        assert!(parse_percentage("-1,00").is_err());
        assert!(
            parse_percentage("62,485").is_err(),
            "3 decimals are ambiguous"
        );
        assert!(parse_percentage("abc").is_err());
        assert!(parse_percentage("1 000,00").is_err());
    }

    #[test]
    fn decimals_scale_to_one_place_for_the_usage_average() {
        assert_eq!(
            parse_decimal("120,93", 1),
            Err(DecimalError::Malformed { scale: 1 })
        );
        assert_eq!(parse_decimal("120,9", 1), Ok(Some(1209)));
        assert_eq!(parse_decimal("120", 1), Ok(Some(1200)));
        assert_eq!(parse_decimal("", 1), Ok(None));
    }

    /// The 2021/22–2024/25 vendor exports write a bare dash in optional metric
    /// columns with no value («ИИ-контент» is `-` for every pre-AI-detector
    /// row) - observed on the real backfill (W4.3), where it rejected ~18 600
    /// rows as `invalid_percentage`. A dash means absence for the four
    /// optional metrics, and stays a rejection for «Оригинальность».
    #[test]
    fn dash_means_absent_in_optional_metric_columns_only() {
        let pepper = Pepper::new("dev-pepper").unwrap();
        let rules = RuleSet::new(
            Vec::new(),
            Vec::new(),
            std::collections::HashMap::new(),
            7,
            1,
            1,
        );
        let row = |originality: &str, ai: &str| {
            let record = csv::StringRecord::from(vec![
                "01.09.2021 10:00",
                "Курсовая работа по теме",
                "Автор А.",
                originality,
                "-",
                "–",
                "-",
                "Проверяющий",
                "reviewer@teachers.tou.edu.kz",
                "Нет",
                "Нет",
                "Не удален",
                "/report/full/2021000001?userId=555",
                ai,
            ]);
            parse_row(1, &record, &pepper, &rules)
        };

        match row("91,50", "-") {
            RowOutcome::Row(parsed) => {
                assert_eq!(parsed.originality.hundredths(), 9150);
                assert_eq!(parsed.self_citation_hundredths, None);
                assert_eq!(parsed.citation_hundredths, None);
                assert_eq!(parsed.match_hundredths, None);
                assert_eq!(parsed.ai_content_hundredths, None);
            }
            other => panic!("dash-valued optional columns must parse: {other:?}"),
        }

        match row("-", "12,00") {
            RowOutcome::Rejected(rejection) => {
                assert_eq!(rejection.kind, RejectionKind::InvalidPercentage);
            }
            other => panic!("a dash originality must stay a rejection: {other:?}"),
        }
    }
}
