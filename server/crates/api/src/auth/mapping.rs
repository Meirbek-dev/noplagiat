//! AD group → role + scope mapping (`settings.role_mappings`, ADR-014 §3).
//!
//! The portal IdP hands the dashboard an ID token whose group claim carries AD
//! group names. Those names are a university-administrative fact, not a
//! dashboard one, so the translation table is a runtime **setting** rather than
//! compiled-in: Комплаенс can add a new dean's group without a redeploy, which
//! is the same reasoning ADR-008 §8 applies to every other threshold.
//!
//! # Shape
//!
//! ```json
//! [
//!   {"group": "TOU-Noplagiat-Admin",  "role": "admin"},
//!   {"group": "TOU-Compliance",       "role": "compliance"},
//!   {"group": "TOU-Dean-FAC03",       "role": "dean",      "faculty_code": "FAC03"},
//!   {"group": "TOU-Head-DEP11",       "role": "dept_head", "department_code": "DEP11"}
//! ]
//! ```
//!
//! A `dean` or `dept_head` entry **must** carry its unit code: `RoleGrant::scope`
//! reads a unit role with no unit as "no data", so an incomplete mapping row is
//! a grant that sees nothing rather than a grant that sees everything
//! (ADR-012 §4). The parser refuses those rows outright so the mistake surfaces
//! in the admin editor instead of at the next sign-in.
//!
//! Matching is case-insensitive on the group name, because AD group names round
//! trip through several systems that disagree about case.

use serde::{Deserialize, Serialize};

use crate::auth::RoleGrant;

/// `settings` key holding the table.
pub const ROLE_MAPPINGS_KEY: &str = "role_mappings";

/// One AD group's meaning.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, utoipa::ToSchema)]
#[serde(deny_unknown_fields)]
pub struct RoleMapping {
    /// AD group name as the IdP spells it in the claim.
    pub group: String,
    /// `staff`, `dept_head`, `dean`, `ethics`, `compliance` or `admin`.
    pub role: String,
    /// Faculty dictionary code - required for `dean`.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub faculty_code: Option<String>,
    /// Department dictionary code - required for `dept_head`.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub department_code: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum MappingError {
    #[error("mapping {index}: `{role}` is not a role of the system")]
    UnknownRole { index: usize, role: String },
    #[error("mapping {index}: a `{role}` mapping must name its unit code")]
    UnitRoleWithoutUnit { index: usize, role: String },
    #[error("mapping {index}: the group name must not be empty")]
    EmptyGroup { index: usize },
    #[error("`role_mappings` is not a list of mappings: {0}")]
    Malformed(String),
}

/// The table shipped when `settings.role_mappings` has never been written.
///
/// University-wide roles only: a dean or a head is always faculty-specific, so
/// those rows are data the university supplies (PLAN.md D7), not a default this
/// code can guess.
pub const DEFAULT_MAPPINGS_JSON: &str = r#"[
  {"group": "noplagiat-admin", "role": "admin"},
  {"group": "noplagiat-compliance", "role": "compliance"},
  {"group": "noplagiat-ethics", "role": "ethics"},
  {"group": "noplagiat-staff", "role": "staff"}
]"#;

/// Parse and validate the setting value.
pub fn parse(value: &serde_json::Value) -> Result<Vec<RoleMapping>, MappingError> {
    let mappings: Vec<RoleMapping> = serde_json::from_value(value.clone())
        .map_err(|error| MappingError::Malformed(error.to_string()))?;
    validate(&mappings)?;
    Ok(mappings)
}

/// Reject the shapes that would silently mis-grant.
pub fn validate(mappings: &[RoleMapping]) -> Result<(), MappingError> {
    for (index, mapping) in mappings.iter().enumerate() {
        if mapping.group.trim().is_empty() {
            return Err(MappingError::EmptyGroup { index });
        }
        let Some(role) = crate::auth::parse_role(&mapping.role) else {
            return Err(MappingError::UnknownRole {
                index,
                role: mapping.role.clone(),
            });
        };
        let needs_unit = matches!(role, domain::RoleKind::Dean | domain::RoleKind::DeptHead);
        let has_unit = match role {
            domain::RoleKind::Dean => mapping.faculty_code.is_some(),
            domain::RoleKind::DeptHead => mapping.department_code.is_some(),
            _ => true,
        };
        if needs_unit && !has_unit {
            return Err(MappingError::UnitRoleWithoutUnit {
                index,
                role: mapping.role.clone(),
            });
        }
    }
    Ok(())
}

/// The default table, parsed. Falls back to an empty table rather than
/// panicking if the constant above is ever edited into something malformed -
/// an empty table means "everyone lands on the request-access page", which is
/// the safe direction.
#[must_use]
pub fn defaults() -> Vec<RoleMapping> {
    serde_json::from_str(DEFAULT_MAPPINGS_JSON).unwrap_or_default()
}

/// Unit codes a mapping table refers to, so the caller can resolve them to ids
/// in one dictionary read.
#[must_use]
pub fn referenced_codes(mappings: &[RoleMapping]) -> (Vec<&str>, Vec<&str>) {
    let faculties = mappings
        .iter()
        .filter_map(|mapping| mapping.faculty_code.as_deref())
        .collect();
    let departments = mappings
        .iter()
        .filter_map(|mapping| mapping.department_code.as_deref())
        .collect();
    (faculties, departments)
}

/// Resolve the caller's group memberships into grants.
///
/// `faculty_ids` / `department_ids` map dictionary codes to ids. A mapping whose
/// unit code is unknown to the dictionaries is **skipped** with a warning: a
/// dean grant with an unresolvable faculty would collapse to "no unit", and
/// `RoleGrant::scope` reads that as no data - the grant would look present and
/// see nothing, which is worse than not being there.
#[must_use]
pub fn grants_for(
    mappings: &[RoleMapping],
    groups: &[String],
    faculty_ids: &std::collections::HashMap<String, i64>,
    department_ids: &std::collections::HashMap<String, i64>,
) -> Vec<RoleGrant> {
    let mut grants: Vec<RoleGrant> = Vec::new();
    for group in groups {
        for mapping in mappings
            .iter()
            .filter(|mapping| mapping.group.eq_ignore_ascii_case(group))
        {
            let Some(role) = crate::auth::parse_role(&mapping.role) else {
                continue;
            };
            let faculty = match mapping.faculty_code.as_deref() {
                Some(code) => match faculty_ids.get(code) {
                    Some(id) => Some(*id),
                    None => {
                        tracing::warn!(
                            role = %mapping.role,
                            "role mapping names a faculty the dictionaries do not know - skipped"
                        );
                        continue;
                    }
                },
                None => None,
            };
            let department = match mapping.department_code.as_deref() {
                Some(code) => match department_ids.get(code) {
                    Some(id) => Some(*id),
                    None => {
                        tracing::warn!(
                            role = %mapping.role,
                            "role mapping names a department the dictionaries do not know - skipped"
                        );
                        continue;
                    }
                },
                None => None,
            };
            let grant = RoleGrant {
                role,
                scope_faculty_id: faculty,
                scope_department_id: department,
                // The mapping row already spells the codes out, so a grant
                // established at sign-in names its unit without a lookup.
                scope_faculty_code: mapping.faculty_code.clone(),
                scope_department_code: mapping.department_code.clone(),
            };
            if !grants.contains(&grant) {
                grants.push(grant);
            }
        }
    }
    grants
}

#[cfg(test)]
mod tests {
    use super::*;
    use domain::RoleKind;
    use std::collections::HashMap;

    fn ids(pairs: &[(&str, i64)]) -> HashMap<String, i64> {
        pairs
            .iter()
            .map(|(code, id)| ((*code).to_owned(), *id))
            .collect()
    }

    fn table() -> Vec<RoleMapping> {
        parse(&serde_json::json!([
            {"group": "TOU-Compliance", "role": "compliance"},
            {"group": "TOU-Dean-FAC03", "role": "dean", "faculty_code": "FAC03"},
            {"group": "TOU-Head-DEP11", "role": "dept_head", "department_code": "DEP11"},
            {"group": "TOU-Dean-GONE", "role": "dean", "faculty_code": "NOPE"},
        ]))
        .expect("the table is well formed")
    }

    #[test]
    fn the_shipped_defaults_parse_and_validate() {
        let defaults = defaults();
        assert!(!defaults.is_empty());
        assert_eq!(validate(&defaults), Ok(()));
    }

    #[test]
    fn a_group_maps_to_its_role_and_scope() {
        let grants = grants_for(
            &table(),
            &["TOU-Dean-FAC03".to_owned()],
            &ids(&[("FAC03", 3)]),
            &ids(&[]),
        );
        assert_eq!(
            grants,
            vec![RoleGrant {
                role: RoleKind::Dean,
                scope_faculty_id: Some(3),
                scope_department_id: None,
                scope_faculty_code: Some("FAC03".to_owned()),
                scope_department_code: None,
            }]
        );
        assert_eq!(
            crate::auth::widest_scope(&grants),
            Some(compliance::Scope::Faculty(3))
        );
    }

    #[test]
    fn group_matching_ignores_case_and_unknown_groups() {
        let grants = grants_for(
            &table(),
            &["tou-compliance".to_owned(), "TOU-Something-Else".to_owned()],
            &ids(&[]),
            &ids(&[]),
        );
        assert_eq!(grants.len(), 1);
        assert_eq!(grants[0].role, RoleKind::Compliance);
    }

    #[test]
    fn a_mapping_whose_unit_is_unknown_grants_nothing_at_all() {
        // Not "a dean with no faculty" - that would look granted and see
        // nothing. It is skipped entirely.
        let grants = grants_for(
            &table(),
            &["TOU-Dean-GONE".to_owned()],
            &ids(&[("FAC03", 3)]),
            &ids(&[]),
        );
        assert!(grants.is_empty());
    }

    #[test]
    fn several_groups_accumulate_without_duplicates() {
        let grants = grants_for(
            &table(),
            &[
                "TOU-Compliance".to_owned(),
                "TOU-Compliance".to_owned(),
                "TOU-Head-DEP11".to_owned(),
            ],
            &ids(&[]),
            &ids(&[("DEP11", 11)]),
        );
        assert_eq!(grants.len(), 2);
    }

    #[test]
    fn a_unit_role_without_a_unit_is_refused_at_parse_time() {
        let error = parse(&serde_json::json!([{"group": "g", "role": "dean"}]))
            .expect_err("a dean mapping must name its faculty");
        assert!(matches!(error, MappingError::UnitRoleWithoutUnit { .. }));

        let error = parse(&serde_json::json!([{"group": "g", "role": "dept_head"}]))
            .expect_err("a head mapping must name its department");
        assert!(matches!(error, MappingError::UnitRoleWithoutUnit { .. }));
    }

    #[test]
    fn an_unknown_role_or_empty_group_is_refused() {
        assert!(matches!(
            parse(&serde_json::json!([{"group": "g", "role": "root"}])),
            Err(MappingError::UnknownRole { .. })
        ));
        assert!(matches!(
            parse(&serde_json::json!([{"group": " ", "role": "admin"}])),
            Err(MappingError::EmptyGroup { .. })
        ));
        assert!(matches!(
            parse(&serde_json::json!({"group": "g"})),
            Err(MappingError::Malformed(_))
        ));
        // An unknown field is a typo, not something to ignore.
        assert!(matches!(
            parse(&serde_json::json!([{"group": "g", "role": "admin", "facultyCode": "F"}])),
            Err(MappingError::Malformed(_))
        ));
    }

    #[test]
    fn referenced_codes_are_collected_for_one_dictionary_read() {
        let table = table();
        let (faculties, departments) = referenced_codes(&table);
        assert_eq!(faculties, vec!["FAC03", "NOPE"]);
        assert_eq!(departments, vec!["DEP11"]);
    }
}
