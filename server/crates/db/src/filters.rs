//! The vetted filter composition point (AGENTS.md §5: "Dynamic SQL only via
//! the vetted filter-builder in `db::filters`").
//!
//! Nothing here concatenates SQL. Every dashboard query is a fixed, compile
//! checked statement over the `agg_cells` / `fact_cells` functions installed by
//! migration 0003; this module only turns a [`domain::Filters`] plus a
//! [`compliance::Scope`] into the bind parameters those functions take, and
//! splits a period into the whole months that `agg_monthly` can answer and the
//! at-most-two boundary day ranges that only the fact table can.
//!
//! All date arithmetic is on **local +05:00 calendar days** (ADR-008 §1). The
//! conversion to instants happens in SQL, once, inside the two functions.

use compliance::Scope;
use domain::{CheckStatus, Filters, InitiatorRole, Period};
use jiff::Span;
use jiff::civil::Date as CivilDate;
use sqlx::types::time::Date as SqlDate;

use crate::DbError;

/// A period split into the part `agg_monthly` can serve and the part it cannot.
///
/// `agg_monthly` is keyed by the first day of a month, so it answers a range
/// exactly when that range covers whole months. An arbitrary range contributes
/// at most two partial months - its first and its last - and those are
/// re-aggregated from `checks` (ARCHITECTURE.md §3.3).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PeriodBinds {
    from: SqlDate,
    to: SqlDate,
    full_from: Option<SqlDate>,
    full_to: Option<SqlDate>,
    partial1: Option<(SqlDate, SqlDate)>,
    partial2: Option<(SqlDate, SqlDate)>,
    month_aligned: bool,
}

impl PeriodBinds {
    /// Split `period` into whole months plus boundary day ranges.
    pub fn split(period: Period) -> Result<Self, DbError> {
        let from = period.start();
        let to = period.end();
        let from_month = from.first_of_month();
        let to_month = to.first_of_month();
        let from_aligned = from == from_month;
        let to_aligned = to == to.last_of_month();

        /// An inclusive range of local civil days.
        type DayRange = (CivilDate, CivilDate);

        let (full, partials): (Option<DayRange>, Vec<DayRange>) = if from_month == to_month {
            if from_aligned && to_aligned {
                (Some((from_month, to_month)), Vec::new())
            } else {
                // One partial month: the range never leaves it.
                (None, vec![(from, to)])
            }
        } else {
            let full_from = if from_aligned {
                from_month
            } else {
                add_months(from_month, 1)?
            };
            let full_to = if to_aligned {
                to_month
            } else {
                add_months(to_month, -1)?
            };
            let mut partials = Vec::new();
            if !from_aligned {
                partials.push((from, from.last_of_month()));
            }
            if !to_aligned {
                partials.push((to_month, to));
            }
            let full = (full_from <= full_to).then_some((full_from, full_to));
            (full, partials)
        };

        let mut ranges = partials.into_iter();
        Ok(Self {
            from: to_sql_date(from)?,
            to: to_sql_date(to)?,
            full_from: full.map(|(start, _)| to_sql_date(start)).transpose()?,
            full_to: full.map(|(_, end)| to_sql_date(end)).transpose()?,
            partial1: ranges.next().map(to_sql_range).transpose()?,
            partial2: ranges.next().map(to_sql_range).transpose()?,
            month_aligned: from_aligned && to_aligned,
        })
    }

    /// Whether the period covers whole months only - the condition under which
    /// a monthly-grain materialized view can answer it on its own.
    #[must_use]
    pub fn is_month_aligned(self) -> bool {
        self.month_aligned
    }

    pub(crate) fn from(self) -> SqlDate {
        self.from
    }

    pub(crate) fn to(self) -> SqlDate {
        self.to
    }

    pub(crate) fn full_from(self) -> Option<SqlDate> {
        self.full_from
    }

    pub(crate) fn full_to(self) -> Option<SqlDate> {
        self.full_to
    }

    pub(crate) fn partial1_from(self) -> Option<SqlDate> {
        self.partial1.map(|(start, _)| start)
    }

    pub(crate) fn partial1_to(self) -> Option<SqlDate> {
        self.partial1.map(|(_, end)| end)
    }

    pub(crate) fn partial2_from(self) -> Option<SqlDate> {
        self.partial2.map(|(start, _)| start)
    }

    pub(crate) fn partial2_to(self) -> Option<SqlDate> {
        self.partial2.map(|(_, end)| end)
    }
}

/// Every bind parameter of `agg_cells` / `fact_cells`, derived from the caller's
/// filters, RBAC scope and the `settings.exclude_deleted` toggle.
///
/// Construction is the only way to obtain one, and it always requires a
/// [`Scope`]: there is no way to build binds for an unscoped query
/// (AGENTS.md invariant #3).
#[derive(Debug, Clone, Copy)]
pub struct QueryBinds<'a> {
    period: PeriodBinds,
    exclude_deleted: bool,
    scope_faculty_id: Option<i64>,
    scope_department_id: Option<i64>,
    faculty_code: Option<&'a str>,
    department_code: Option<&'a str>,
    program_code: Option<&'a str>,
    work_type_code: Option<&'a str>,
    status: Option<&'static str>,
    initiator: Option<&'static str>,
}

impl<'a> QueryBinds<'a> {
    pub fn new(filters: &'a Filters, scope: Scope, exclude_deleted: bool) -> Result<Self, DbError> {
        let (scope_faculty_id, scope_department_id) = scope.bindings();
        Ok(Self {
            period: PeriodBinds::split(filters.period())?,
            exclude_deleted,
            scope_faculty_id,
            scope_department_id,
            faculty_code: filters.faculty().map(domain::DictionaryCode::as_str),
            department_code: filters.department().map(domain::DictionaryCode::as_str),
            program_code: filters.program().map(domain::DictionaryCode::as_str),
            work_type_code: filters.work_type().map(domain::DictionaryCode::as_str),
            status: filters.status().map(status_label),
            initiator: filters.initiator().map(initiator_label),
        })
    }

    #[must_use]
    pub fn period(&self) -> PeriodBinds {
        self.period
    }

    /// Whether any filter outside the (month, faculty, department) key of
    /// `agg_usage_monthly` is set. A distinct-reviewer count under such a
    /// filter cannot come from that view and must be recomputed from facts.
    #[must_use]
    pub fn needs_row_level_usage(&self) -> bool {
        !self.exclude_deleted
            || !self.period.is_month_aligned()
            || self.program_code.is_some()
            || self.work_type_code.is_some()
            || self.status.is_some()
            || self.initiator.is_some()
    }

    pub(crate) fn exclude_deleted(&self) -> bool {
        self.exclude_deleted
    }

    pub(crate) fn scope_faculty_id(&self) -> Option<i64> {
        self.scope_faculty_id
    }

    pub(crate) fn scope_department_id(&self) -> Option<i64> {
        self.scope_department_id
    }

    pub(crate) fn faculty_code(&self) -> Option<&'a str> {
        self.faculty_code
    }

    pub(crate) fn department_code(&self) -> Option<&'a str> {
        self.department_code
    }

    pub(crate) fn program_code(&self) -> Option<&'a str> {
        self.program_code
    }

    pub(crate) fn work_type_code(&self) -> Option<&'a str> {
        self.work_type_code
    }

    pub(crate) fn status(&self) -> Option<&'static str> {
        self.status
    }

    pub(crate) fn initiator(&self) -> Option<&'static str> {
        self.initiator
    }
}

/// The `check_status` enum label of a domain status. Spelled out rather than
/// derived from `serde` so a rename in the wire format cannot silently change
/// what the database is asked for.
#[must_use]
pub fn status_label(status: CheckStatus) -> &'static str {
    match status {
        CheckStatus::Accepted => "accepted",
        CheckStatus::NeedsRevision => "needs_revision",
        CheckStatus::Rejected => "rejected",
        CheckStatus::Recheck => "recheck",
    }
}

/// The `initiator_role` enum label of a domain initiator.
#[must_use]
pub fn initiator_label(initiator: InitiatorRole) -> &'static str {
    match initiator {
        InitiatorRole::Student => "student",
        InitiatorRole::StaffSelf => "staff_self",
        InitiatorRole::Registrar => "registrar",
        InitiatorRole::Other => "other",
    }
}

/// The `role_kind` enum label of a domain role.
#[must_use]
pub fn role_label(role: domain::RoleKind) -> &'static str {
    match role {
        domain::RoleKind::Staff => "staff",
        domain::RoleKind::DeptHead => "dept_head",
        domain::RoleKind::Dean => "dean",
        domain::RoleKind::Ethics => "ethics",
        domain::RoleKind::Compliance => "compliance",
        domain::RoleKind::Admin => "admin",
    }
}

fn add_months(date: CivilDate, months: i32) -> Result<CivilDate, DbError> {
    let span = Span::new()
        .try_months(months)
        .map_err(|_| DbError::DateOutOfRange(date.to_string()))?;
    date.checked_add(span)
        .map_err(|_| DbError::DateOutOfRange(date.to_string()))
}

fn to_sql_range(range: (CivilDate, CivilDate)) -> Result<(SqlDate, SqlDate), DbError> {
    Ok((to_sql_date(range.0)?, to_sql_date(range.1)?))
}

/// `jiff` is the calendar arithmetic of the domain layer; `time` is what the
/// PostgreSQL driver speaks. Going through the ordinal day avoids naming
/// `time::Month`, which the driver does not re-export, and cannot disagree with
/// `jiff` about leap years.
fn to_sql_date(date: CivilDate) -> Result<SqlDate, DbError> {
    let out_of_range = || DbError::DateOutOfRange(date.to_string());
    let ordinal = u16::try_from(date.day_of_year()).map_err(|_| out_of_range())?;
    SqlDate::from_ordinal_date(i32::from(date.year()), ordinal).map_err(|_| out_of_range())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn period(from: (i16, i8, i8), to: (i16, i8, i8)) -> Period {
        Period::new(
            jiff::civil::date(from.0, from.1, from.2),
            jiff::civil::date(to.0, to.1, to.2),
        )
        .expect("test period is ordered")
    }

    fn day(year: i16, month: i8, day: i8) -> SqlDate {
        to_sql_date(jiff::civil::date(year, month, day)).expect("valid calendar day")
    }

    #[test]
    fn a_month_aligned_period_needs_no_fact_scan() {
        // Sep 1 – Aug 31: exactly twelve whole months.
        let binds = PeriodBinds::split(period((2025, 9, 1), (2026, 8, 31))).expect("splits");
        assert!(binds.is_month_aligned());
        assert_eq!(binds.full_from(), Some(day(2025, 9, 1)));
        assert_eq!(binds.full_to(), Some(day(2026, 8, 1)));
        assert_eq!(binds.partial1_from(), None);
        assert_eq!(binds.partial2_from(), None);
    }

    #[test]
    fn a_range_crossing_one_boundary_has_two_partial_months_and_no_whole_one() {
        // The `custom-range-crossing-month` fixture scenario.
        let binds = PeriodBinds::split(period((2025, 10, 15), (2025, 11, 14))).expect("splits");
        assert!(!binds.is_month_aligned());
        assert_eq!(binds.full_from(), None);
        assert_eq!(binds.full_to(), None);
        assert_eq!(binds.partial1_from(), Some(day(2025, 10, 15)));
        assert_eq!(binds.partial1_to(), Some(day(2025, 10, 31)));
        assert_eq!(binds.partial2_from(), Some(day(2025, 11, 1)));
        assert_eq!(binds.partial2_to(), Some(day(2025, 11, 14)));
    }

    #[test]
    fn a_long_ragged_range_keeps_the_middle_months_on_the_aggregate() {
        let binds = PeriodBinds::split(period((2025, 10, 15), (2026, 3, 10))).expect("splits");
        assert_eq!(binds.full_from(), Some(day(2025, 11, 1)));
        assert_eq!(binds.full_to(), Some(day(2026, 2, 1)));
        assert_eq!(binds.partial1_from(), Some(day(2025, 10, 15)));
        assert_eq!(binds.partial1_to(), Some(day(2025, 10, 31)));
        assert_eq!(binds.partial2_from(), Some(day(2026, 3, 1)));
        assert_eq!(binds.partial2_to(), Some(day(2026, 3, 10)));
    }

    #[test]
    fn a_sub_month_range_is_one_partial_and_nothing_else() {
        let binds = PeriodBinds::split(period((2025, 10, 15), (2025, 10, 20))).expect("splits");
        assert_eq!(binds.full_from(), None);
        assert_eq!(binds.partial1_from(), Some(day(2025, 10, 15)));
        assert_eq!(binds.partial1_to(), Some(day(2025, 10, 20)));
        assert_eq!(binds.partial2_from(), None);
    }

    #[test]
    fn a_single_whole_month_is_aggregate_only() {
        let binds = PeriodBinds::split(period((2025, 11, 1), (2025, 11, 30))).expect("splits");
        assert!(binds.is_month_aligned());
        assert_eq!(binds.full_from(), Some(day(2025, 11, 1)));
        assert_eq!(binds.full_to(), Some(day(2025, 11, 1)));
        assert_eq!(binds.partial1_from(), None);
    }

    #[test]
    fn february_end_alignment_follows_the_calendar() {
        let leap = PeriodBinds::split(period((2024, 2, 1), (2024, 2, 29))).expect("splits");
        assert!(leap.is_month_aligned());
        let common = PeriodBinds::split(period((2025, 2, 1), (2025, 2, 28))).expect("splits");
        assert!(common.is_month_aligned());
        let short = PeriodBinds::split(period((2024, 2, 1), (2024, 2, 28))).expect("splits");
        assert!(!short.is_month_aligned(), "Feb 28 2024 is not a month end");
    }

    #[test]
    fn scope_reaches_the_bind_parameters_unchanged() {
        let filters = Filters::new(period((2025, 9, 1), (2026, 8, 31)));
        let binds = QueryBinds::new(&filters, Scope::Faculty(7), true).expect("binds");
        assert_eq!(binds.scope_faculty_id(), Some(7));
        assert_eq!(binds.scope_department_id(), None);

        let binds = QueryBinds::new(&filters, Scope::Department(11), true).expect("binds");
        assert_eq!(binds.scope_faculty_id(), None);
        assert_eq!(binds.scope_department_id(), Some(11));

        let binds = QueryBinds::new(&filters, Scope::All, true).expect("binds");
        assert_eq!(
            (binds.scope_faculty_id(), binds.scope_department_id()),
            (None, None)
        );
    }

    #[test]
    fn enum_labels_match_the_postgres_enum_values() {
        assert_eq!(status_label(CheckStatus::NeedsRevision), "needs_revision");
        assert_eq!(initiator_label(InitiatorRole::StaffSelf), "staff_self");
        assert_eq!(role_label(domain::RoleKind::DeptHead), "dept_head");
    }
}
