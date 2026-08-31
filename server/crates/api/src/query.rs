//! Typed, validated query parameters (TZ §4.3, ARCHITECTURE.md §4.6).
//!
//! Filters arrive as strings and leave as a [`domain::Filters`]. Nothing in
//! between is optional: an unknown parameter, a malformed date, an unknown
//! status or an inverted range is a `422` problem naming the offending field -
//! never a silently ignored filter, because a filter that is ignored produces a
//! *plausible wrong number*, which is worse than an error.
//!
//! Every field is declared as `Option<String>` on purpose. Deserializing
//! straight into enums would let `serde` fail first, and its message names the
//! variant but not the field; validating strings with `garde` gives every
//! rejection a field path.

use axum::extract::{FromRequestParts, Query};
use axum::http::request::Parts;
use domain::{CheckStatus, DictionaryCode, Filters, Period, PeriodPreset, SemesterBoundaries};
use garde::Validate;
use jiff::civil::Date;
use serde::Deserialize;
use serde::de::DeserializeOwned;

use crate::error::{ApiError, FieldError};

/// The university's civil calendar is fixed +05:00 (ADR-008 §1), so "today"
/// means the same day for a period preset as it does for `checks.academic_year`.
const UNIVERSITY_OFFSET: jiff::tz::Offset = jiff::tz::Offset::constant(5);

/// Reference date for the relative period presets.
#[must_use]
pub fn today() -> Date {
    jiff::Timestamp::now()
        .to_zoned(jiff::tz::TimeZone::fixed(UNIVERSITY_OFFSET))
        .date()
}

/// Wire names of the period quick picks, matching `apps/web/src/lib/search.ts`.
const PERIOD_PRESETS: [&str; 6] = ["month", "semester", "year", "3y", "5y", "custom"];
/// Wire names of `domain::CheckStatus`.
const STATUSES: [&str; 4] = ["accepted", "needs_revision", "rejected", "recheck"];

/// The public-contour filter set (TZ §4.3 minus the internal dimensions).
///
/// `department`, `program` and `initiator` are deliberately **not** accepted
/// here. The public contour publishes faculty grain at most (TZ §4.2 §4), so a
/// public request asking for department detail is rejected outright rather than
/// quietly widened - `deny_unknown_fields` turns it into a `422`.
///
/// **`status` was removed by ADR-016 §3** and is now internal only. The public
/// contour publishes sums over cube cells that hold at least `k` checks; adding
/// status to the cube key shatters the grain - 1 244 sub-`k` groups against a
/// handful at three dimensions, roughly 5 % of all rows - so the filter would
/// buy a dimension at the price of suppressing the data. It reaches this struct
/// as an unknown field and is answered with the same `422` as `department`.
#[derive(Debug, Default, Deserialize, Validate, utoipa::IntoParams, utoipa::ToSchema)]
#[serde(deny_unknown_fields)]
#[into_params(parameter_in = Query)]
pub struct PublicFilterQuery {
    /// Quick period pick: `month`, `semester`, `year` (academic year, the
    /// default), `3y`, `5y` or `custom`. With any preset other than `custom`,
    /// `from`/`to` are still validated but the preset determines the range.
    #[garde(inner(custom(known(&PERIOD_PRESETS, "period"))))]
    pub period: Option<String>,
    /// Inclusive range start, `YYYY-MM-DD`. Required when `period=custom`.
    ///
    /// **Snapped down to the first day of its month** (ADR-016 §1): the public
    /// contour answers whole months only, so that walking a window's end by one
    /// day cannot isolate a single check. The `period` echoed in the response
    /// is the snapped range, not the requested one.
    #[garde(inner(custom(iso_date)))]
    pub from: Option<String>,
    /// Inclusive range end, `YYYY-MM-DD`. Required when `period=custom`.
    ///
    /// **Snapped up to the last day of its month** (ADR-016 §1); see `from`.
    /// The quick picks are already month-aligned, so snapping changes nothing
    /// for them.
    #[garde(inner(custom(iso_date), custom(not_before(self.from.as_deref()))))]
    pub to: Option<String>,
    /// Faculty dictionary code.
    #[garde(inner(custom(dictionary_code)))]
    pub faculty: Option<String>,
    /// Work-type dictionary code.
    #[garde(inner(custom(dictionary_code)))]
    pub work_type: Option<String>,
}

impl PublicFilterQuery {
    /// Turn validated strings into the domain filter value.
    ///
    /// `boundaries` come from `settings.semester_boundaries` so the «семестр»
    /// quick pick follows ADR-008 §8 without a redeploy.
    ///
    /// The resolved period is **snapped to whole months** - the single place
    /// the public contour's month grain is enforced, so no handler can forget
    /// it and no `db::q` call can receive a ragged public range.
    pub fn resolve(
        &self,
        boundaries: SemesterBoundaries,
        reference: Date,
    ) -> Result<Filters, ApiError> {
        let period = self
            .period_preset()?
            .resolve(reference, boundaries)?
            .snap_to_months();
        let mut filters = Filters::new(period);
        if let Some(code) = &self.faculty {
            filters = filters.with_faculty(code_of("faculty", code)?);
        }
        if let Some(code) = &self.work_type {
            filters = filters.with_work_type(code_of("work_type", code)?);
        }
        Ok(filters)
    }

    /// The preset this request asked for. Absent `period` with a `from`/`to`
    /// pair means a custom range; absent everything means the academic year,
    /// matching the frontend default.
    fn period_preset(&self) -> Result<PeriodPreset, ApiError> {
        preset_of(
            self.period.as_deref(),
            self.from.as_deref(),
            self.to.as_deref(),
        )
    }
}

/// Wire names of `domain::InitiatorRole`.
const INITIATORS: [&str; 4] = ["student", "staff_self", "registrar", "other"];

/// The internal-contour filter set: the public dimensions plus the three the
/// internal contour adds (TZ §4.3 «на внутреннем контуре - дополнительно
/// кафедра и ОП»).
///
/// Accepting `department`/`program` here is not the same as *allowing* them:
/// [`ScopeGuard::narrow`] checks every unit value against the caller's
/// [`compliance::Scope`] before the filters reach SQL, and a value outside it is
/// a `403`, never an empty result set. Answering "no rows" would leak the same
/// fact more slowly - it tells the caller the unit exists and is empty for
/// them, and it makes an out-of-scope probe indistinguishable from a genuinely
/// empty quarter.
#[derive(Debug, Default, Deserialize, Validate, utoipa::IntoParams, utoipa::ToSchema)]
#[serde(deny_unknown_fields)]
#[into_params(parameter_in = Query)]
pub struct InternalFilterQuery {
    /// Quick period pick: `month`, `semester`, `year` (the default), `3y`,
    /// `5y` or `custom`.
    #[garde(inner(custom(known(&PERIOD_PRESETS, "period"))))]
    pub period: Option<String>,
    /// Inclusive range start, `YYYY-MM-DD`.
    #[garde(inner(custom(iso_date)))]
    pub from: Option<String>,
    /// Inclusive range end, `YYYY-MM-DD`.
    #[garde(inner(custom(iso_date), custom(not_before(self.from.as_deref()))))]
    pub to: Option<String>,
    /// Faculty dictionary code.
    #[garde(inner(custom(dictionary_code)))]
    pub faculty: Option<String>,
    /// Department dictionary code.
    #[garde(inner(custom(dictionary_code)))]
    pub department: Option<String>,
    /// Programme (ОП) dictionary code.
    #[garde(inner(custom(dictionary_code)))]
    pub program: Option<String>,
    /// Work-type dictionary code.
    #[garde(inner(custom(dictionary_code)))]
    pub work_type: Option<String>,
    /// Check status: `accepted`, `needs_revision`, `rejected` or `recheck`.
    #[garde(inner(custom(known(&STATUSES, "status"))))]
    pub status: Option<String>,
    /// Who initiated the check: `student`, `staff_self`, `registrar`, `other`.
    #[garde(inner(custom(known(&INITIATORS, "initiator"))))]
    pub initiator: Option<String>,
}

impl InternalFilterQuery {
    /// Turn validated strings into the domain filter value. The scope check is
    /// [`ScopeGuard::narrow`]'s job and happens first at every call site.
    pub fn resolve(
        &self,
        boundaries: SemesterBoundaries,
        reference: Date,
    ) -> Result<Filters, ApiError> {
        let period = self.period_preset()?.resolve(reference, boundaries)?;
        let mut filters = Filters::new(period);
        for (field, value, apply) in [
            (
                "faculty",
                self.faculty.as_deref(),
                Filters::with_faculty as fn(Filters, DictionaryCode) -> Filters,
            ),
            (
                "department",
                self.department.as_deref(),
                Filters::with_department,
            ),
            ("program", self.program.as_deref(), Filters::with_program),
            (
                "work_type",
                self.work_type.as_deref(),
                Filters::with_work_type,
            ),
        ] {
            if let Some(code) = value {
                filters = apply(filters, code_of(field, code)?);
            }
        }
        if let Some(status) = &self.status {
            filters = filters.with_status(status_of(status)?);
        }
        if let Some(initiator) = &self.initiator {
            filters = filters.with_initiator(initiator_of(initiator)?);
        }
        Ok(filters)
    }

    fn period_preset(&self) -> Result<PeriodPreset, ApiError> {
        preset_of(
            self.period.as_deref(),
            self.from.as_deref(),
            self.to.as_deref(),
        )
    }
}

/// The dictionary tree, loaded once per request so unit codes can be resolved
/// and checked against the caller's scope without a query per code.
#[derive(Debug, Clone)]
pub struct ScopeGuard {
    scope: compliance::Scope,
    /// `faculty code → id`.
    faculties: std::collections::HashMap<String, i64>,
    /// `department code → (id, faculty id)`.
    departments: std::collections::HashMap<String, (i64, i64)>,
    /// `program code → (id, department id, faculty id)`.
    programs: std::collections::HashMap<String, (i64, i64, i64)>,
}

impl ScopeGuard {
    pub async fn load(pool: &db::Pool, scope: compliance::Scope) -> Result<Self, ApiError> {
        let faculties: std::collections::HashMap<String, i64> = db::dicts::faculties(pool)
            .await?
            .into_iter()
            .map(|faculty| (faculty.code, faculty.id))
            .collect();
        let departments: std::collections::HashMap<String, (i64, i64)> =
            db::dicts::departments(pool)
                .await?
                .into_iter()
                .map(|department| (department.code, (department.id, department.faculty_id)))
                .collect();
        let by_department_id: std::collections::HashMap<i64, i64> = departments
            .values()
            .map(|(id, faculty_id)| (*id, *faculty_id))
            .collect();
        let programs = db::dicts::programs(pool)
            .await?
            .into_iter()
            .filter_map(|program| {
                let faculty_id = by_department_id.get(&program.department_id)?;
                Some((
                    program.code,
                    (program.id, program.department_id, *faculty_id),
                ))
            })
            .collect();
        Ok(Self {
            scope,
            faculties,
            departments,
            programs,
        })
    }

    #[must_use]
    pub fn scope(&self) -> compliance::Scope {
        self.scope
    }

    /// The faculty id a scope is confined to, if any.
    #[must_use]
    fn scope_faculty(&self) -> Option<i64> {
        match self.scope {
            compliance::Scope::All => None,
            compliance::Scope::Faculty(id) => Some(id),
            compliance::Scope::Department(id) => self
                .departments
                .values()
                .find(|(department_id, _)| *department_id == id)
                .map(|(_, faculty_id)| *faculty_id),
        }
    }

    /// Check every unit code in `query` against the caller's scope.
    ///
    /// * an unknown code is a `422` naming the parameter - a filter that is
    ///   silently dropped produces a plausible wrong number;
    /// * a code outside the caller's scope is a `403`.
    pub fn narrow(&self, query: &InternalFilterQuery) -> Result<(), ApiError> {
        if let Some(code) = query.faculty.as_deref() {
            let id = *self
                .faculties
                .get(code)
                .ok_or_else(|| ApiError::field("faculty", format!("unknown faculty `{code}`")))?;
            if self.scope_faculty().is_some_and(|allowed| allowed != id) {
                return Err(out_of_scope("faculty"));
            }
        }
        if let Some(code) = query.department.as_deref() {
            let (id, faculty_id) = *self.departments.get(code).ok_or_else(|| {
                ApiError::field("department", format!("unknown department `{code}`"))
            })?;
            if !self.department_visible(id, faculty_id) {
                return Err(out_of_scope("department"));
            }
        }
        if let Some(code) = query.program.as_deref() {
            let (_, department_id, faculty_id) = *self
                .programs
                .get(code)
                .ok_or_else(|| ApiError::field("program", format!("unknown programme `{code}`")))?;
            if !self.department_visible(department_id, faculty_id) {
                return Err(out_of_scope("program"));
            }
        }
        Ok(())
    }

    fn department_visible(&self, department_id: i64, faculty_id: i64) -> bool {
        match self.scope {
            compliance::Scope::All => true,
            compliance::Scope::Faculty(allowed) => allowed == faculty_id,
            compliance::Scope::Department(allowed) => allowed == department_id,
        }
    }
}

/// The 403 an out-of-scope unit filter produces.
fn out_of_scope(field: &'static str) -> ApiError {
    tracing::warn!(field, "an out-of-scope unit filter was refused");
    ApiError::OutOfScope("the requested unit is outside your area of visibility")
}

fn initiator_of(value: &str) -> Result<domain::InitiatorRole, ApiError> {
    match value {
        "student" => Ok(domain::InitiatorRole::Student),
        "staff_self" => Ok(domain::InitiatorRole::StaffSelf),
        "registrar" => Ok(domain::InitiatorRole::Registrar),
        "other" => Ok(domain::InitiatorRole::Other),
        other => Err(ApiError::field(
            "initiator",
            format!("unknown initiator role `{other}`"),
        )),
    }
}

/// Shared period resolution for both contours' query structs.
fn preset_of(
    period: Option<&str>,
    from: Option<&str>,
    to: Option<&str>,
) -> Result<PeriodPreset, ApiError> {
    let custom = || -> Result<PeriodPreset, ApiError> {
        Ok(PeriodPreset::Custom {
            from: parse_date("from", from)?,
            to: parse_date("to", to)?,
        })
    };
    match period {
        Some("month") => Ok(PeriodPreset::Month),
        Some("semester") => Ok(PeriodPreset::Semester),
        Some("year") => Ok(PeriodPreset::AcademicYear),
        Some("3y") => Ok(PeriodPreset::ThreeYears),
        Some("5y") => Ok(PeriodPreset::FiveYears),
        Some("custom") => custom(),
        None if from.is_some() || to.is_some() => custom(),
        None => Ok(PeriodPreset::AcademicYear),
        Some(other) => Err(ApiError::field(
            "period",
            format!("unknown period preset `{other}`"),
        )),
    }
}

/// Resolve an internal request's period against the runtime semester
/// boundaries.
pub async fn internal_filters_from(
    pool: &db::Pool,
    query: &InternalFilterQuery,
) -> Result<Filters, ApiError> {
    let boundaries = db::settings::semester_boundaries(pool).await?;
    query.resolve(boundaries, today())
}

/// The comparison window for the KPI deltas: the same filters one year earlier
/// (TZ §4.2 §9). `domain` proves the alignment - shifting a resolved academic
/// year or semester back a year lands exactly on the period the previous year
/// would have resolved to.
pub fn previous_year(filters: &Filters) -> Result<Filters, ApiError> {
    filters.previous_year().map_err(Into::into)
}

impl From<domain::PeriodError> for ApiError {
    fn from(error: domain::PeriodError) -> Self {
        Self::field("period", error.to_string())
    }
}

fn parse_date(field: &'static str, value: Option<&str>) -> Result<Date, ApiError> {
    let raw = value.ok_or_else(|| {
        ApiError::field(
            field,
            "required when `period=custom` or a custom range is implied",
        )
    })?;
    raw.parse::<Date>()
        .map_err(|_| ApiError::field(field, "expected a calendar date in YYYY-MM-DD form"))
}

fn code_of(field: &'static str, value: &str) -> Result<DictionaryCode, ApiError> {
    DictionaryCode::new(value.to_owned()).map_err(|error| ApiError::field(field, error.to_string()))
}

fn status_of(value: &str) -> Result<CheckStatus, ApiError> {
    match value {
        "accepted" => Ok(CheckStatus::Accepted),
        "needs_revision" => Ok(CheckStatus::NeedsRevision),
        "rejected" => Ok(CheckStatus::Rejected),
        "recheck" => Ok(CheckStatus::Recheck),
        other => Err(ApiError::field(
            "status",
            format!("unknown check status `{other}`"),
        )),
    }
}

// ── garde rules ─────────────────────────────────────────────────────────────

fn iso_date(value: &str, _context: &()) -> garde::Result {
    value
        .parse::<Date>()
        .map(|_| ())
        .map_err(|_| garde::Error::new("expected a calendar date in YYYY-MM-DD form"))
}

/// Membership in a closed vocabulary, with the accepted values in the message
/// so a caller can fix the request without reading the contract.
fn known(
    allowed: &'static [&'static str],
    field: &'static str,
) -> impl FnOnce(&str, &()) -> garde::Result {
    move |value, _context| {
        if allowed.contains(&value) {
            Ok(())
        } else {
            Err(garde::Error::new(format!(
                "unknown {field} `{value}`; expected one of {}",
                allowed.join(", ")
            )))
        }
    }
}

fn dictionary_code(value: &str, _context: &()) -> garde::Result {
    DictionaryCode::new(value.to_owned())
        .map(|_| ())
        .map_err(|error| garde::Error::new(error.to_string()))
}

/// Cross-field rule: an inverted range is a request for nothing, so it is an
/// error rather than an empty result set.
fn not_before(from: Option<&str>) -> impl FnOnce(&str, &()) -> garde::Result + '_ {
    move |to, _context| {
        let (Some(from), Ok(to)) = (from, to.parse::<Date>()) else {
            return Ok(());
        };
        match from.parse::<Date>() {
            Ok(from) if from > to => Err(garde::Error::new("`to` must not be earlier than `from`")),
            _ => Ok(()),
        }
    }
}

// ── extractor ───────────────────────────────────────────────────────────────

/// Deserialize and validate a query struct, or reject with a `422` problem that
/// names every offending field.
#[derive(Debug, Clone, Copy, Default)]
pub struct ValidQuery<T>(pub T);

impl<S, T> FromRequestParts<S> for ValidQuery<T>
where
    S: Send + Sync,
    T: DeserializeOwned + Validate<Context = ()> + Send,
{
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let Query(value) = Query::<T>::try_from_uri(&parts.uri).map_err(|rejection| {
            let detail = rejection.body_text();
            ApiError::Validation {
                errors: vec![FieldError {
                    field: unknown_field_name(&detail).unwrap_or_else(|| "query".to_owned()),
                    message: detail.clone(),
                }],
                detail,
            }
        })?;

        value.validate().map_err(|report| {
            let errors: Vec<FieldError> = report
                .iter()
                .map(|(path, error)| FieldError {
                    field: path.to_string(),
                    message: error.to_string(),
                })
                .collect();
            ApiError::Validation {
                detail: format!(
                    "{} query parameter{} rejected",
                    errors.len(),
                    if errors.len() == 1 { " was" } else { "s were" }
                ),
                errors,
            }
        })?;
        Ok(Self(value))
    }
}

/// Deserialize and validate a JSON request body, or reject with a `422`
/// problem that names every offending field.
///
/// An **empty** body is the default value of `T`: the export endpoints take
/// their filters in the body, and "export the default period" is a legitimate
/// request that should not have to spell out `{}`.
pub fn validated_body<T>(body: &[u8]) -> Result<T, ApiError>
where
    T: DeserializeOwned + Validate<Context = ()> + Default,
{
    let value: T = if body.iter().all(u8::is_ascii_whitespace) {
        T::default()
    } else {
        serde_json::from_slice(body).map_err(|error| {
            let detail = error.to_string();
            ApiError::Validation {
                errors: vec![FieldError {
                    field: unknown_field_name(&detail).unwrap_or_else(|| "body".to_owned()),
                    message: detail.clone(),
                }],
                detail,
            }
        })?
    };
    value.validate().map_err(report_to_error)?;
    Ok(value)
}

/// Turn a `garde` report into the `422` problem body.
fn report_to_error(report: garde::Report) -> ApiError {
    let errors: Vec<FieldError> = report
        .iter()
        .map(|(path, error)| FieldError {
            field: path.to_string(),
            message: error.to_string(),
        })
        .collect();
    ApiError::Validation {
        detail: format!(
            "{} filter{} rejected",
            errors.len(),
            if errors.len() == 1 { " was" } else { "s were" }
        ),
        errors,
    }
}

/// Pull the field name out of serde's `unknown field \`x\`` message so an
/// unsupported parameter is reported against that parameter.
fn unknown_field_name(message: &str) -> Option<String> {
    let rest = message.split_once("unknown field `")?.1;
    let name = rest.split_once('`')?.0;
    (!name.is_empty()).then(|| name.to_owned())
}

/// Resolve a request's period against the runtime semester boundaries.
pub async fn filters_from(pool: &db::Pool, query: &PublicFilterQuery) -> Result<Filters, ApiError> {
    let boundaries = db::settings::semester_boundaries(pool).await?;
    query.resolve(boundaries, today())
}

/// The period a set of filters covers, for echoing back in a response.
#[must_use]
pub fn period_bounds(period: Period) -> (String, String) {
    (period.start().to_string(), period.end().to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn query(raw: &str) -> PublicFilterQuery {
        serde_urlencoded_shim(raw)
    }

    /// `axum::extract::Query` is exercised end to end by the integration tests;
    /// here the struct is built directly so the resolution logic is unit-tested
    /// without an HTTP round trip.
    fn serde_urlencoded_shim(raw: &str) -> PublicFilterQuery {
        let mut query = PublicFilterQuery::default();
        for pair in raw.split('&').filter(|pair| !pair.is_empty()) {
            let (key, value) = pair.split_once('=').unwrap_or((pair, ""));
            let value = Some(value.to_owned());
            match key {
                "period" => query.period = value,
                "from" => query.from = value,
                "to" => query.to = value,
                "faculty" => query.faculty = value,
                "work_type" => query.work_type = value,
                other => panic!("unexpected test parameter {other}"),
            }
        }
        query
    }

    fn date(year: i16, month: i8, day: i8) -> Date {
        jiff::civil::date(year, month, day)
    }

    #[test]
    fn the_default_period_is_the_academic_year() {
        let filters = query("")
            .resolve(SemesterBoundaries::default(), date(2026, 2, 15))
            .expect("empty filters resolve");
        assert_eq!(filters.period().start(), date(2025, 9, 1));
        assert_eq!(filters.period().end(), date(2026, 8, 31));
    }

    #[test]
    fn every_preset_resolves_to_its_pinned_range() {
        let boundaries = SemesterBoundaries::default();
        let reference = date(2026, 2, 15);
        let range = |raw: &str| {
            let filters = query(raw).resolve(boundaries, reference).expect(raw);
            (filters.period().start(), filters.period().end())
        };
        assert_eq!(range("period=month"), (date(2026, 2, 1), date(2026, 2, 28)));
        assert_eq!(
            range("period=semester"),
            (date(2026, 2, 1), date(2026, 8, 31))
        );
        assert_eq!(range("period=year"), (date(2025, 9, 1), date(2026, 8, 31)));
        assert_eq!(range("period=3y"), (date(2023, 9, 1), date(2026, 8, 31)));
        assert_eq!(range("period=5y"), (date(2021, 9, 1), date(2026, 8, 31)));
        // A public custom range is widened to whole months (ADR-016 §1); the
        // day-grain original lives on in `InternalFilterQuery`.
        assert_eq!(
            range("period=custom&from=2025-10-15&to=2025-11-14"),
            (date(2025, 10, 1), date(2025, 11, 30))
        );
        // A bare from/to pair implies a custom range.
        assert_eq!(
            range("from=2025-10-15&to=2025-11-14"),
            (date(2025, 10, 1), date(2025, 11, 30))
        );
    }

    #[test]
    fn a_custom_period_without_bounds_is_a_field_error() {
        let error = query("period=custom&from=2025-10-15")
            .resolve(SemesterBoundaries::default(), date(2026, 2, 15))
            .expect_err("custom needs both ends");
        assert!(matches!(error, ApiError::Validation { .. }));
    }

    #[test]
    fn garde_rejects_malformed_filters_with_a_field_path() {
        let report = query("from=15.10.2025&faculty=&period=decade")
            .validate()
            .expect_err("three parameters are malformed");
        let fields: Vec<String> = report.iter().map(|(path, _)| path.to_string()).collect();
        assert!(fields.contains(&"from".to_owned()), "{fields:?}");
        assert!(fields.contains(&"faculty".to_owned()), "{fields:?}");
        assert!(fields.contains(&"period".to_owned()), "{fields:?}");
    }

    /// ADR-016 §1: whatever days a caller asks for, the public contour answers
    /// whole months - so no window can be walked one day at a time.
    #[test]
    fn a_public_custom_range_is_snapped_to_whole_months() {
        let filters = query("from=2025-10-15&to=2025-11-14")
            .resolve(SemesterBoundaries::default(), date(2026, 2, 15))
            .expect("a ragged range resolves");
        assert_eq!(filters.period().start(), date(2025, 10, 1));
        assert_eq!(filters.period().end(), date(2025, 11, 30));

        // February keeps its own length in its own year.
        let leap = query("from=2024-02-10&to=2024-02-20")
            .resolve(SemesterBoundaries::default(), date(2026, 2, 15))
            .expect("a ragged range resolves");
        assert_eq!(leap.period().end(), date(2024, 2, 29));

        // The internal contour keeps day grain.
        let internal = InternalFilterQuery {
            from: Some("2025-10-15".to_owned()),
            to: Some("2025-11-14".to_owned()),
            ..InternalFilterQuery::default()
        }
        .resolve(SemesterBoundaries::default(), date(2026, 2, 15))
        .expect("a ragged internal range resolves");
        assert_eq!(internal.period().start(), date(2025, 10, 15));
        assert_eq!(internal.period().end(), date(2025, 11, 14));
    }

    /// ADR-016 §3: `status` left the public filter set, so it is an unknown
    /// parameter - the same `422` `department` has always produced.
    #[test]
    fn the_public_filter_set_no_longer_carries_status() {
        let rejected = serde_json::from_str::<PublicFilterQuery>(r#"{"status":"accepted"}"#)
            .expect_err("`status` is no longer a public parameter");
        assert_eq!(
            unknown_field_name(&rejected.to_string()),
            Some("status".to_owned()),
            "{rejected}"
        );
        // It remains an internal dimension.
        assert!(serde_json::from_str::<InternalFilterQuery>(r#"{"status":"accepted"}"#).is_ok());
    }

    #[test]
    fn an_inverted_range_is_rejected_against_the_end_of_it() {
        let report = query("from=2026-01-01&to=2025-01-01")
            .validate()
            .expect_err("an inverted range is invalid");
        let fields: Vec<String> = report.iter().map(|(path, _)| path.to_string()).collect();
        assert_eq!(fields, vec!["to".to_owned()]);
    }

    #[test]
    fn a_well_formed_range_passes() {
        assert!(
            query("from=2025-01-01&to=2026-01-01&faculty=FAC03&work_type=course")
                .validate()
                .is_ok()
        );
    }

    #[test]
    fn the_unknown_parameter_name_is_recovered_from_serde() {
        assert_eq!(
            unknown_field_name(
                "Failed to deserialize query string: unknown field `department`, expected one of `period`, `from`"
            ),
            Some("department".to_owned())
        );
        assert_eq!(unknown_field_name("some other failure"), None);
    }
}
