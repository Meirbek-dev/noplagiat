//! The filter state of TZ §4.3, as one pure value.
//!
//! Filters carry validated dictionary *codes*, never ids and never labels: the
//! db lane resolves codes to ids in SQL and combines them with the caller's
//! [`compliance::Scope`]. Nothing here builds SQL - that keeps the URL search
//! params, the audit-log `filters` column and the export header all reading
//! from the same value.

use serde::Serialize;

use crate::period::Period;
use crate::{CheckStatus, DictionaryCode, InitiatorRole};

/// A filter combination. Every dimension is optional and they compose freely
/// (TZ §4.3 «фильтры работают в любой комбинации»); the period is not, because
/// every metric is period-scoped.
///
/// The serialized shape is the normalized form written to `audit_log.filters`.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct Filters {
    #[serde(flatten)]
    period: Period,
    #[serde(skip_serializing_if = "Option::is_none")]
    faculty: Option<DictionaryCode>,
    #[serde(skip_serializing_if = "Option::is_none")]
    department: Option<DictionaryCode>,
    #[serde(skip_serializing_if = "Option::is_none")]
    program: Option<DictionaryCode>,
    #[serde(skip_serializing_if = "Option::is_none")]
    work_type: Option<DictionaryCode>,
    #[serde(skip_serializing_if = "Option::is_none")]
    status: Option<CheckStatus>,
    #[serde(skip_serializing_if = "Option::is_none")]
    initiator: Option<InitiatorRole>,
}

impl Filters {
    #[must_use]
    pub fn new(period: Period) -> Self {
        Self {
            period,
            faculty: None,
            department: None,
            program: None,
            work_type: None,
            status: None,
            initiator: None,
        }
    }

    #[must_use]
    pub fn with_faculty(mut self, code: DictionaryCode) -> Self {
        self.faculty = Some(code);
        self
    }

    #[must_use]
    pub fn with_department(mut self, code: DictionaryCode) -> Self {
        self.department = Some(code);
        self
    }

    #[must_use]
    pub fn with_program(mut self, code: DictionaryCode) -> Self {
        self.program = Some(code);
        self
    }

    #[must_use]
    pub fn with_work_type(mut self, code: DictionaryCode) -> Self {
        self.work_type = Some(code);
        self
    }

    #[must_use]
    pub fn with_status(mut self, status: CheckStatus) -> Self {
        self.status = Some(status);
        self
    }

    #[must_use]
    pub fn with_initiator(mut self, initiator: InitiatorRole) -> Self {
        self.initiator = Some(initiator);
        self
    }

    #[must_use]
    pub fn period(&self) -> Period {
        self.period
    }

    #[must_use]
    pub fn faculty(&self) -> Option<&DictionaryCode> {
        self.faculty.as_ref()
    }

    #[must_use]
    pub fn department(&self) -> Option<&DictionaryCode> {
        self.department.as_ref()
    }

    #[must_use]
    pub fn program(&self) -> Option<&DictionaryCode> {
        self.program.as_ref()
    }

    #[must_use]
    pub fn work_type(&self) -> Option<&DictionaryCode> {
        self.work_type.as_ref()
    }

    #[must_use]
    pub fn status(&self) -> Option<CheckStatus> {
        self.status
    }

    #[must_use]
    pub fn initiator(&self) -> Option<InitiatorRole> {
        self.initiator
    }

    /// The same filters over the comparison period one year back (TZ §4.2 §9).
    pub fn previous_year(&self) -> Result<Self, crate::period::PeriodError> {
        Ok(Self {
            period: self.period.previous_year()?,
            ..self.clone()
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::period::{PeriodPreset, SemesterBoundaries};

    fn period() -> Period {
        PeriodPreset::AcademicYear
            .resolve(
                jiff::civil::date(2026, 2, 15),
                SemesterBoundaries::default(),
            )
            .expect("the pinned reference date resolves")
    }

    #[test]
    fn empty_filters_serialize_to_the_period_alone() {
        let json = serde_json::to_value(Filters::new(period())).expect("filters serialize");
        assert_eq!(
            json,
            serde_json::json!({"from": "2025-09-01", "to": "2026-08-31"})
        );
    }

    #[test]
    fn set_dimensions_round_trip_into_the_audit_shape() {
        let filters = Filters::new(period())
            .with_faculty(DictionaryCode::new("ENG".into()).expect("valid code"))
            .with_work_type(DictionaryCode::new("thesis".into()).expect("valid code"))
            .with_status(CheckStatus::Rejected)
            .with_initiator(InitiatorRole::StaffSelf);

        assert_eq!(
            serde_json::to_value(&filters).expect("filters serialize"),
            serde_json::json!({
                "from": "2025-09-01",
                "to": "2026-08-31",
                "faculty": "ENG",
                "work_type": "thesis",
                "status": "rejected",
                "initiator": "staff_self",
            })
        );
        assert_eq!(filters.faculty().map(DictionaryCode::as_str), Some("ENG"));
        assert_eq!(filters.department(), None);
    }

    #[test]
    fn previous_year_shifts_only_the_period() {
        let filters = Filters::new(period())
            .with_faculty(DictionaryCode::new("ENG".into()).expect("valid code"));
        let previous = filters.previous_year().expect("the shift stays in range");
        assert_eq!(previous.faculty(), filters.faculty());
        assert_eq!(previous.period().start(), jiff::civil::date(2024, 9, 1));
        assert_eq!(previous.period().end(), jiff::civil::date(2025, 8, 31));
    }
}
