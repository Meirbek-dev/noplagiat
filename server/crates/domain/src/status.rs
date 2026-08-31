//! Status derivation (D6 / ADR-008 §4).
//!
//! The legacy exports carry no check status; it is derived from the columns
//! that do exist. The ladder is *data*, not control flow, so Комплаенс can
//! change it through `settings.status_rules` without a redeploy or a
//! re-derivation of this crate. [`StatusRules::default`] is the pinned default
//! and is byte-identical to the JSON seeded by migration 0002.

use serde::{Deserialize, Serialize};

use crate::{AttemptNo, CheckStatus, OriginalityPct};

/// A predicate over one check, evaluated against [`StatusInput`].
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum StatusCondition {
    /// A repeat check of the same work (ADR-008 §3 attempt grouping).
    #[serde(rename = "attempt_gt_1")]
    AttemptGreaterThanOne,
    /// «Подозрительный документ» = Да and «Отметка о подозрительности снята» ≠ Да.
    #[serde(rename = "suspicious_not_cleared")]
    SuspiciousNotCleared,
    /// Originality below `settings.originality_threshold` (default 70 %).
    #[serde(rename = "below_threshold")]
    BelowOriginalityThreshold,
    /// Unconditional - useful as an explicit catch-all rule.
    #[serde(rename = "always")]
    Always,
    /// Never matches - the way to disable escalation entirely.
    #[serde(rename = "never")]
    Never,
}

impl StatusCondition {
    #[must_use]
    pub fn matches(self, input: &StatusInput) -> bool {
        match self {
            Self::AttemptGreaterThanOne => input.attempt_no.get() > 1,
            Self::SuspiciousNotCleared => input.suspicious && !input.suspicion_cleared,
            Self::BelowOriginalityThreshold => {
                input.originality.hundredths() < input.originality_threshold.hundredths()
            }
            Self::Always => true,
            Self::Never => false,
        }
    }
}

/// One rung of the ladder: when `when` matches, the status is `status`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct StatusRule {
    pub when: StatusCondition,
    pub status: CheckStatus,
}

/// The facts a rule can look at. Deliberately free of anything nominative.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct StatusInput {
    pub attempt_no: AttemptNo,
    pub suspicious: bool,
    pub suspicion_cleared: bool,
    pub originality: OriginalityPct,
    pub originality_threshold: OriginalityPct,
}

/// Result of the derivation: the status plus the independent escalation flag.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub struct DerivedStatus {
    pub status: CheckStatus,
    pub escalated: bool,
}

/// The admin-editable ladder (`settings.status_rules`).
///
/// First match wins; `default` applies when nothing matched. `escalate_when` is
/// evaluated separately - escalation is *not* a consequence of the status, so a
/// rule change on the ladder cannot silently drop escalations (ADR-008 §4).
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct StatusRules {
    #[serde(default = "default_rules")]
    rules: Vec<StatusRule>,
    #[serde(rename = "default", default = "default_status")]
    default_status: CheckStatus,
    #[serde(default = "default_escalate_when")]
    escalate_when: StatusCondition,
}

impl StatusRules {
    #[must_use]
    pub fn new(
        rules: Vec<StatusRule>,
        default_status: CheckStatus,
        escalate_when: StatusCondition,
    ) -> Self {
        Self {
            rules,
            default_status,
            escalate_when,
        }
    }

    #[must_use]
    pub fn rules(&self) -> &[StatusRule] {
        &self.rules
    }

    #[must_use]
    pub fn default_status(&self) -> CheckStatus {
        self.default_status
    }

    #[must_use]
    pub fn escalate_when(&self) -> StatusCondition {
        self.escalate_when
    }

    /// Apply the ladder. First match wins.
    #[must_use]
    pub fn derive(&self, input: &StatusInput) -> DerivedStatus {
        let status = self
            .rules
            .iter()
            .find(|rule| rule.when.matches(input))
            .map_or(self.default_status, |rule| rule.status);

        DerivedStatus {
            status,
            escalated: self.escalate_when.matches(input),
        }
    }
}

impl Default for StatusRules {
    /// The ADR-008 §4 ladder.
    fn default() -> Self {
        Self {
            rules: default_rules(),
            default_status: default_status(),
            escalate_when: default_escalate_when(),
        }
    }
}

fn default_rules() -> Vec<StatusRule> {
    vec![
        StatusRule {
            when: StatusCondition::AttemptGreaterThanOne,
            status: CheckStatus::Recheck,
        },
        StatusRule {
            when: StatusCondition::SuspiciousNotCleared,
            status: CheckStatus::Rejected,
        },
        StatusRule {
            when: StatusCondition::BelowOriginalityThreshold,
            status: CheckStatus::NeedsRevision,
        },
    ]
}

fn default_status() -> CheckStatus {
    CheckStatus::Accepted
}

fn default_escalate_when() -> StatusCondition {
    StatusCondition::SuspiciousNotCleared
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;

    /// Byte-for-byte the JSON seeded into `settings.status_rules` by 0002.
    const SEEDED_JSON: &str = r#"{"rules": [{"when": "attempt_gt_1", "status": "recheck"}, {"when": "suspicious_not_cleared", "status": "rejected"}, {"when": "below_threshold", "status": "needs_revision"}], "default": "accepted", "escalate_when": "suspicious_not_cleared"}"#;

    fn input(
        attempt: u32,
        suspicious: bool,
        cleared: bool,
        originality_hundredths: u16,
    ) -> StatusInput {
        StatusInput {
            attempt_no: AttemptNo::new(attempt).expect("test attempt is non-zero"),
            suspicious,
            suspicion_cleared: cleared,
            originality: OriginalityPct::from_hundredths(originality_hundredths)
                .expect("test originality is in range"),
            originality_threshold: OriginalityPct::from_hundredths(7_000)
                .expect("the default threshold is in range"),
        }
    }

    #[test]
    fn seeded_settings_json_equals_the_pinned_default() {
        let parsed: StatusRules =
            serde_json::from_str(SEEDED_JSON).expect("the migration seed parses");
        assert_eq!(parsed, StatusRules::default());
    }

    #[test]
    fn unknown_keys_are_rejected_rather_than_ignored() {
        // A typo in an admin edit must fail loudly, not silently change nothing.
        assert!(serde_json::from_str::<StatusRules>(r#"{"defualt": "accepted"}"#).is_err());
        assert!(
            serde_json::from_str::<StatusRules>(r#"{"rules": [{"when": "attempt_gt_2"}]}"#)
                .is_err()
        );
    }

    #[test]
    fn ladder_matches_adr_008_section_4() {
        let rules = StatusRules::default();
        // 1. attempt > 1 wins over everything else.
        assert_eq!(
            rules.derive(&input(2, true, false, 1_000)).status,
            CheckStatus::Recheck
        );
        // 2. suspicious and not cleared.
        assert_eq!(
            rules.derive(&input(1, true, false, 9_900)).status,
            CheckStatus::Rejected
        );
        // 2'. cleared suspicion falls through the rung.
        assert_eq!(
            rules.derive(&input(1, true, true, 9_900)).status,
            CheckStatus::Accepted
        );
        // 3. below threshold.
        assert_eq!(
            rules.derive(&input(1, false, false, 6_999)).status,
            CheckStatus::NeedsRevision
        );
        // 3'. exactly at the threshold is not below it.
        assert_eq!(
            rules.derive(&input(1, false, false, 7_000)).status,
            CheckStatus::Accepted
        );
    }

    #[test]
    fn escalation_is_independent_of_the_ladder() {
        let rules = StatusRules::default();
        // A recheck of a still-suspicious work is `recheck` and escalated.
        let derived = rules.derive(&input(3, true, false, 9_000));
        assert_eq!(derived.status, CheckStatus::Recheck);
        assert!(derived.escalated);
    }

    #[test]
    fn an_admin_override_changes_the_outcome() {
        let rules: StatusRules = serde_json::from_str(
            r#"{"rules": [{"when": "always", "status": "needs_revision"}], "escalate_when": "never"}"#,
        )
        .expect("an override parses");
        let derived = rules.derive(&input(4, true, false, 10_000));
        assert_eq!(derived.status, CheckStatus::NeedsRevision);
        assert!(!derived.escalated);
    }

    proptest! {
        /// The pinned ladder: a repeat attempt is always a recheck, and
        /// escalation holds exactly when the work is suspicious and uncleared.
        #[test]
        fn pinned_ladder_invariants(
            attempt in 1_u32..50,
            suspicious: bool,
            cleared: bool,
            originality in 0_u16..=10_000,
        ) {
            let rules = StatusRules::default();
            let candidate = input(attempt, suspicious, cleared, originality);
            let derived = rules.derive(&candidate);

            if attempt > 1 {
                prop_assert_eq!(derived.status, CheckStatus::Recheck);
            } else {
                prop_assert_ne!(derived.status, CheckStatus::Recheck);
            }
            prop_assert_eq!(derived.escalated, suspicious && !cleared);
        }

        /// Derivation is total and deterministic: every input yields a status,
        /// and the same input always yields the same one.
        #[test]
        fn derivation_is_deterministic(
            attempt in 1_u32..50,
            suspicious: bool,
            cleared: bool,
            originality in 0_u16..=10_000,
        ) {
            let rules = StatusRules::default();
            let candidate = input(attempt, suspicious, cleared, originality);
            prop_assert_eq!(rules.derive(&candidate), rules.derive(&candidate));
        }
    }
}
