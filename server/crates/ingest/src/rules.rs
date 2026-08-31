//! The admin-editable derivation rules (ADR-008 §5, §6, §7).
//!
//! Every rule is *data* loaded from the warehouse, never control flow: if
//! Комплаенс disputes a classification (PLAN R5) the fix is a row edit plus a
//! re-ingest, not a redeploy. The matching subjects - a normalized title and a
//! normalized e-mail - are borrowed inside [`crate::row::parse_row`] and never
//! stored.

use std::collections::HashMap;

use domain::{InitiatorRole, REF_LEN, ReviewerRef};

/// A `work_type_rules` row: case-insensitive **substring** match against
/// `norm(Название документа)`; first match by `(priority, id)` wins; no match
/// falls through to `other`/«иное» (ADR-008 §7).
#[derive(Debug, Clone)]
pub struct WorkTypeRule {
    /// Already normalized, so matching is a plain `contains`.
    pub pattern: String,
    pub work_type_id: i64,
}

/// An `initiator_rules` row: a regular expression over `norm(e-mail)`.
///
/// Regex rather than substring because the ADR-008 §5 defaults are anchored
/// (`^registrar`, `^reg\.`) while the domain rule is not (`@teachers.tou.edu.kz`),
/// and an admin editing these needs one predictable semantics for both.
#[derive(Debug, Clone)]
pub struct InitiatorRule {
    pub pattern: regex::Regex,
    pub initiator: InitiatorRole,
}

/// Everything the per-row pipeline needs, loaded once per batch.
#[derive(Debug, Clone)]
pub struct RuleSet {
    work_types: Vec<WorkTypeRule>,
    initiators: Vec<InitiatorRule>,
    staff_units: HashMap<[u8; REF_LEN], (i64, i64)>,
    /// `work_types.code = 'other'` - the ADR-008 §7 fallback.
    pub default_work_type_id: i64,
    /// `faculties.code = 'UNASSIGNED'` - the ADR-008 §6 sentinel.
    pub unassigned_faculty_id: i64,
    /// `departments.code = 'UNASSIGNED'`.
    pub unassigned_department_id: i64,
}

impl RuleSet {
    #[must_use]
    pub fn new(
        work_types: Vec<WorkTypeRule>,
        initiators: Vec<InitiatorRule>,
        staff_units: HashMap<[u8; REF_LEN], (i64, i64)>,
        default_work_type_id: i64,
        unassigned_faculty_id: i64,
        unassigned_department_id: i64,
    ) -> Self {
        Self {
            work_types,
            initiators,
            staff_units,
            default_work_type_id,
            unassigned_faculty_id,
            unassigned_department_id,
        }
    }

    /// Classify a normalized title. Callers pass `norm(title)`.
    #[must_use]
    pub fn work_type(&self, normalized_title: &str) -> i64 {
        self.work_types
            .iter()
            .find(|rule| normalized_title.contains(&rule.pattern))
            .map_or(self.default_work_type_id, |rule| rule.work_type_id)
    }

    /// Classify a normalized e-mail. Callers pass `norm(email)`.
    #[must_use]
    pub fn initiator(&self, normalized_email: &str) -> InitiatorRole {
        self.initiators
            .iter()
            .find(|rule| rule.pattern.is_match(normalized_email))
            .map_or(InitiatorRole::Other, |rule| rule.initiator)
    }

    /// Resolve a reviewer to a unit, or to the `UNASSIGNED` sentinels.
    ///
    /// Pre-2025/26 years are structurally «Не распределено» (PLAN §1.2); this
    /// is where that becomes a row value rather than a NULL.
    #[must_use]
    pub fn unit(&self, reviewer: &ReviewerRef) -> (i64, i64) {
        self.staff_units
            .get(reviewer.as_bytes())
            .copied()
            .unwrap_or((self.unassigned_faculty_id, self.unassigned_department_id))
    }

    #[must_use]
    pub fn work_type_rule_count(&self) -> usize {
        self.work_types.len()
    }

    #[must_use]
    pub fn staff_unit_count(&self) -> usize {
        self.staff_units.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn rule_set() -> RuleSet {
        let work_types = vec![
            WorkTypeRule {
                pattern: "докторская диссертация".into(),
                work_type_id: 1,
            },
            WorkTypeRule {
                pattern: "магистерская диссертация".into(),
                work_type_id: 2,
            },
            WorkTypeRule {
                pattern: "диссертация".into(),
                work_type_id: 3,
            },
        ];
        let initiators = vec![
            InitiatorRule {
                pattern: regex::Regex::new("@teachers\\.tou\\.edu\\.kz").unwrap(),
                initiator: InitiatorRole::StaffSelf,
            },
            InitiatorRule {
                pattern: regex::Regex::new("^registrar").unwrap(),
                initiator: InitiatorRole::Registrar,
            },
            InitiatorRule {
                pattern: regex::Regex::new("^reg\\.").unwrap(),
                initiator: InitiatorRole::Registrar,
            },
        ];
        let mut staff_units = HashMap::new();
        staff_units.insert([7_u8; REF_LEN], (11_i64, 22_i64));
        RuleSet::new(work_types, initiators, staff_units, 900, 99, 98)
    }

    #[test]
    fn the_first_rule_in_priority_order_wins() {
        let rules = rule_set();
        // The caller supplies the ordered list; a more specific pattern placed
        // first must beat the generic one that also matches.
        assert_eq!(rules.work_type("докторская диссертация по физике"), 1);
        assert_eq!(rules.work_type("магистерская диссертация"), 2);
        assert_eq!(rules.work_type("диссертация"), 3);
    }

    #[test]
    fn an_unclassified_title_falls_through_to_other() {
        assert_eq!(rule_set().work_type("реферат по истории"), 900);
    }

    #[test]
    fn initiator_rules_reproduce_the_adr_008_defaults() {
        let rules = rule_set();
        assert_eq!(
            rules.initiator("t.bekbekuly@teachers.tou.edu.kz"),
            InitiatorRole::StaffSelf
        );
        assert_eq!(
            rules.initiator("registrar.office@tou.edu.kz"),
            InitiatorRole::Registrar
        );
        assert_eq!(
            rules.initiator("reg.ops@tou.edu.kz"),
            InitiatorRole::Registrar
        );
        assert_eq!(rules.initiator("someone@gmail.com"), InitiatorRole::Other);
        // `^registrar` must not match a *mid-string* occurrence.
        assert_eq!(
            rules.initiator("x.registrar@tou.edu.kz"),
            InitiatorRole::Other
        );
    }

    #[test]
    fn an_unmapped_reviewer_lands_on_the_sentinels() {
        let rules = rule_set();
        assert_eq!(
            rules.unit(&ReviewerRef::from_bytes([7_u8; REF_LEN])),
            (11, 22)
        );
        assert_eq!(
            rules.unit(&ReviewerRef::from_bytes([8_u8; REF_LEN])),
            (99, 98)
        );
    }
}
