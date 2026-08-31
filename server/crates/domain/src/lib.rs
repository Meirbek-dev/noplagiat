//! Pure business types shared by every other crate. No I/O, no HTTP, no SQL.
//!
//! Invariant #1 (AGENTS.md): nothing in this crate may hold a person's name,
//! an author identifier, or document text. The only identifier is the opaque
//! `source_check_id` issued by the source antiplagiarism system.

use std::num::NonZeroU32;

use serde::{Deserialize, Serialize};

pub mod bucket;
pub mod filters;
pub mod period;
pub mod refs;
pub mod status;

pub use bucket::{Bucket, BucketBoundaries, BucketError};
pub use filters::Filters;
pub use period::{MonthDay, Period, PeriodError, PeriodPreset, Semester, SemesterBoundaries};
pub use refs::{REF_LEN, ReviewerRef, WorkRef};
pub use status::{DerivedStatus, StatusCondition, StatusInput, StatusRule, StatusRules};

/// Outcome of a single plagiarism check attempt.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CheckStatus {
    Accepted,
    NeedsRevision,
    Rejected,
    Recheck,
}

/// Who initiated the check in the source system.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum InitiatorRole {
    Student,
    StaffSelf,
    Registrar,
    Other,
}

/// Internal-contour roles (guests are the absence of a role).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RoleKind {
    Staff,
    DeptHead,
    Dean,
    Ethics,
    Compliance,
    Admin,
}

/// Academic year starting Sep 1. `AcademicYear(2024)` is AY 2024/25.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(transparent)]
pub struct AcademicYear(pub i16);

impl AcademicYear {
    pub fn from_date(date: jiff::civil::Date) -> Self {
        let year = if date.month() >= 9 {
            date.year()
        } else {
            date.year() - 1
        };
        Self(year)
    }

    /// Human label, e.g. "2024–2025".
    pub fn label(self) -> String {
        format!("{}–{}", self.0, self.0 + 1)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum ValidationError {
    #[error("{field} must not be empty")]
    EmptyText { field: &'static str },
    #[error("{field} exceeds its maximum length")]
    TextTooLong { field: &'static str },
    #[error("{field} contains control characters")]
    ControlCharacter { field: &'static str },
    #[error("attempt number must be greater than zero")]
    ZeroAttempt,
    #[error("originality percentage must be between 0.00 and 100.00")]
    OriginalityOutOfRange,
    #[error("{field} must be exactly 32 bytes of HMAC-SHA256 digest")]
    RefLength { field: &'static str },
}

fn validate_text(
    field: &'static str,
    value: String,
    maximum_chars: usize,
) -> Result<String, ValidationError> {
    if value.is_empty() {
        return Err(ValidationError::EmptyText { field });
    }
    if value.chars().count() > maximum_chars {
        return Err(ValidationError::TextTooLong { field });
    }
    if value.chars().any(char::is_control) {
        return Err(ValidationError::ControlCharacter { field });
    }
    Ok(value)
}

/// Opaque identifier assigned by the source system.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize)]
#[serde(transparent)]
pub struct SourceCheckId(String);

impl SourceCheckId {
    pub fn new(value: String) -> Result<Self, ValidationError> {
        validate_text("source_check_id", value, 256).map(Self)
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

/// Stable dictionary code; labels are resolved only inside the ingest/db lane.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize)]
#[serde(transparent)]
pub struct DictionaryCode(String);

impl DictionaryCode {
    pub fn new(value: String) -> Result<Self, ValidationError> {
        validate_text("dictionary_code", value, 128).map(Self)
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize)]
#[serde(transparent)]
pub struct AttemptNo(NonZeroU32);

impl AttemptNo {
    pub fn new(value: u32) -> Result<Self, ValidationError> {
        NonZeroU32::new(value)
            .map(Self)
            .ok_or(ValidationError::ZeroAttempt)
    }

    pub fn get(self) -> u32 {
        self.0.get()
    }
}

/// Percentage represented in hundredths of a percentage point (0..=10_000).
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize)]
#[serde(transparent)]
pub struct OriginalityPct(u16);

impl OriginalityPct {
    pub fn from_hundredths(value: u16) -> Result<Self, ValidationError> {
        if value <= 10_000 {
            Ok(Self(value))
        } else {
            Err(ValidationError::OriginalityOutOfRange)
        }
    }

    pub fn hundredths(self) -> u16 {
        self.0
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize)]
#[serde(transparent)]
pub struct DurationSeconds(u32);

impl DurationSeconds {
    pub fn new(value: u32) -> Self {
        Self(value)
    }

    pub fn get(self) -> u32 {
        self.0
    }
}

/// Validated input used to construct a [`NewCheck`].
#[derive(Debug, Clone)]
pub struct NewCheckInput {
    pub source_check_id: SourceCheckId,
    pub attempt_no: AttemptNo,
    pub checked_at: jiff::Timestamp,
    pub work_type_code: DictionaryCode,
    pub faculty_code: DictionaryCode,
    pub department_code: DictionaryCode,
    pub program_code: Option<DictionaryCode>,
    pub originality_pct: OriginalityPct,
    pub status: CheckStatus,
    pub escalated: bool,
    pub initiator: InitiatorRole,
    pub duration_seconds: Option<DurationSeconds>,
}

/// A validated, PII-free check record ready for warehouse upsert.
///
/// This type cannot be deserialized or assembled field-by-field. The ingest
/// boundary must first reduce an untrusted source row to validated newtypes.
#[derive(Debug, Clone, Serialize)]
pub struct NewCheck {
    source_check_id: SourceCheckId,
    attempt_no: AttemptNo,
    checked_at: jiff::Timestamp,
    work_type_code: DictionaryCode,
    faculty_code: DictionaryCode,
    department_code: DictionaryCode,
    program_code: Option<DictionaryCode>,
    originality_pct: OriginalityPct,
    status: CheckStatus,
    escalated: bool,
    initiator: InitiatorRole,
    duration_seconds: Option<DurationSeconds>,
}

impl NewCheck {
    pub fn new(input: NewCheckInput) -> Self {
        Self {
            source_check_id: input.source_check_id,
            attempt_no: input.attempt_no,
            checked_at: input.checked_at,
            work_type_code: input.work_type_code,
            faculty_code: input.faculty_code,
            department_code: input.department_code,
            program_code: input.program_code,
            originality_pct: input.originality_pct,
            status: input.status,
            escalated: input.escalated,
            initiator: input.initiator,
            duration_seconds: input.duration_seconds,
        }
    }

    pub fn source_check_id(&self) -> &SourceCheckId {
        &self.source_check_id
    }

    pub fn attempt_no(&self) -> AttemptNo {
        self.attempt_no
    }

    pub fn checked_at(&self) -> jiff::Timestamp {
        self.checked_at
    }

    pub fn work_type_code(&self) -> &DictionaryCode {
        &self.work_type_code
    }

    pub fn faculty_code(&self) -> &DictionaryCode {
        &self.faculty_code
    }

    pub fn department_code(&self) -> &DictionaryCode {
        &self.department_code
    }

    pub fn program_code(&self) -> Option<&DictionaryCode> {
        self.program_code.as_ref()
    }

    pub fn originality_pct(&self) -> OriginalityPct {
        self.originality_pct
    }

    pub fn status(&self) -> CheckStatus {
        self.status
    }

    pub fn escalated(&self) -> bool {
        self.escalated
    }

    pub fn initiator(&self) -> InitiatorRole {
        self.initiator
    }

    pub fn duration_seconds(&self) -> Option<DurationSeconds> {
        self.duration_seconds
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn academic_year_boundary_is_september_first() {
        let aug31 = jiff::civil::date(2025, 8, 31);
        let sep1 = jiff::civil::date(2025, 9, 1);
        assert_eq!(AcademicYear::from_date(aug31), AcademicYear(2024));
        assert_eq!(AcademicYear::from_date(sep1), AcademicYear(2025));
        assert_eq!(AcademicYear(2024).label(), "2024–2025");
    }

    /// Field names that would betray a PII-carrying column, wherever they
    /// appear in a serialized structure (AGENTS.md invariant #1).
    const PII_SHAPED_KEYS: [&str; 8] = [
        "name", "fio", "email", "author", "title", "text", "student", "teacher",
    ];

    /// Walk a serialized value and assert no object key looks PII-shaped.
    fn assert_no_pii_shaped_keys(context: &str, value: &serde_json::Value) {
        match value {
            serde_json::Value::Object(map) => {
                for (key, child) in map {
                    let lower = key.to_lowercase();
                    assert!(
                        !PII_SHAPED_KEYS.iter().any(|f| lower.contains(f)),
                        "PII-shaped field `{key}` in {context} - see AGENTS.md invariant #1"
                    );
                    assert_no_pii_shaped_keys(context, child);
                }
            }
            serde_json::Value::Array(items) => {
                for child in items {
                    assert_no_pii_shaped_keys(context, child);
                }
            }
            _ => {}
        }
    }

    /// Structural anti-PII guard: serialized field names of `NewCheck` must
    /// never look like they can carry a person's name, e-mail, or work title.
    #[test]
    fn new_check_has_no_pii_shaped_fields() {
        let sample = NewCheck::new(NewCheckInput {
            source_check_id: SourceCheckId::new("c-1".into()).unwrap(),
            attempt_no: AttemptNo::new(1).unwrap(),
            checked_at: jiff::Timestamp::UNIX_EPOCH,
            work_type_code: DictionaryCode::new("coursework".into()).unwrap(),
            faculty_code: DictionaryCode::new("F1".into()).unwrap(),
            department_code: DictionaryCode::new("D1".into()).unwrap(),
            program_code: None,
            originality_pct: OriginalityPct::from_hundredths(9_150).unwrap(),
            status: CheckStatus::Accepted,
            escalated: false,
            initiator: InitiatorRole::Student,
            duration_seconds: None,
        });
        let json = serde_json::to_value(&sample).unwrap();
        assert_no_pii_shaped_keys("NewCheck", &json);
    }

    /// Every serializable type this crate exposes is covered by the same
    /// guard - a new public struct must be added here, or the test below fails
    /// to prove anything about it.
    #[test]
    fn public_serializable_types_have_no_pii_shaped_fields() {
        let period = PeriodPreset::AcademicYear
            .resolve(
                jiff::civil::date(2026, 2, 15),
                SemesterBoundaries::default(),
            )
            .unwrap();
        let filters = Filters::new(period)
            .with_faculty(DictionaryCode::new("ENG".into()).unwrap())
            .with_department(DictionaryCode::new("SE".into()).unwrap())
            .with_program(DictionaryCode::new("6B06103".into()).unwrap())
            .with_work_type(DictionaryCode::new("thesis".into()).unwrap())
            .with_status(CheckStatus::NeedsRevision)
            .with_initiator(InitiatorRole::Registrar);

        let samples: [(&str, serde_json::Value); 8] = [
            ("Filters", serde_json::to_value(&filters).unwrap()),
            ("Period", serde_json::to_value(period).unwrap()),
            (
                "PeriodPreset",
                serde_json::to_value(PeriodPreset::Custom {
                    from: period.start(),
                    to: period.end(),
                })
                .unwrap(),
            ),
            (
                "SemesterBoundaries",
                serde_json::to_value(SemesterBoundaries::default()).unwrap(),
            ),
            (
                "StatusRules",
                serde_json::to_value(StatusRules::default()).unwrap(),
            ),
            (
                "DerivedStatus",
                serde_json::to_value(StatusRules::default().derive(&StatusInput {
                    attempt_no: AttemptNo::new(1).unwrap(),
                    suspicious: false,
                    suspicion_cleared: false,
                    originality: OriginalityPct::from_hundredths(8_000).unwrap(),
                    originality_threshold: OriginalityPct::from_hundredths(7_000).unwrap(),
                }))
                .unwrap(),
            ),
            (
                "BucketBoundaries",
                serde_json::to_value(BucketBoundaries::default()).unwrap(),
            ),
            ("Bucket", serde_json::to_value(Bucket::ALL).unwrap()),
        ];

        for (context, value) in &samples {
            assert_no_pii_shaped_keys(context, value);
        }
    }

    /// `WorkRef`/`ReviewerRef` are the two derived keys; neither may reach a
    /// response body, and neither may print its digest into a log line.
    #[test]
    fn derived_references_are_opaque_and_redacted() {
        let work = WorkRef::from_bytes([0xfe; REF_LEN]);
        let reviewer = ReviewerRef::from_bytes([0xfe; REF_LEN]);
        for rendered in [format!("{work:?}"), format!("{reviewer:?}")] {
            assert!(rendered.ends_with("(fefefefe…)"), "{rendered}");
            assert!(rendered.matches("fe").count() <= 4, "{rendered}");
        }
        // No `Serialize`, no `Display`, no string constructor: see the
        // `compile_fail` doctests in `refs.rs`.
    }

    #[test]
    fn validated_newtypes_reject_invalid_values() {
        assert!(SourceCheckId::new(String::new()).is_err());
        assert!(DictionaryCode::new("bad\ncode".into()).is_err());
        assert!(AttemptNo::new(0).is_err());
        assert!(OriginalityPct::from_hundredths(10_001).is_err());
        assert_eq!(
            OriginalityPct::from_hundredths(10_000)
                .unwrap()
                .hundredths(),
            10_000
        );
    }
}
