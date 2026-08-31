//! Admin area: settings, dictionaries, aliases, roles, ingest control, audit
//! browser, report generation (TZ §4.6).
//!
//! Sits behind the whole internal stack plus `RequireRole(admin)`, so every
//! handler here already has a session, a scope and an audit row. Two rules the
//! module keeps:
//!
//! 1. **Every mutation is journalled as `admin_change` with a summary of what
//!    it touched** ([`AuditNote::change`]) - keys and entity codes, never the
//!    values written and never a secret. `PUT /settings` records *which* keys
//!    changed, not what they now hold; `POST /staff-units` records the masked
//!    label, never the e-mail it was derived from.
//! 2. **Validation goes through the domain types.** A setting is parsed into
//!    the type that consumes it before it is stored, so a malformed threshold
//!    is a `422` here rather than a `500` on every dashboard request afterwards
//!    (`db::settings` refuses to fall back to a default, by design).

use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, get, post, put};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::auth::mapping;
use crate::auth::{CurrentUser, RbacScope};
use crate::dto::ScopeDto;
use crate::error::ApiError;
use crate::layers::audit::AuditNote;
use crate::routes::export::format_date;
use crate::state::AppState;

/// Page size ceiling for every admin listing. Generous, but bounded: an admin
/// screen that asks for everything must not be able to ask for the whole audit
/// log in one response.
const MAX_PAGE_SIZE: i64 = 500;
const DEFAULT_PAGE_SIZE: i64 = 100;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/ping", get(ping))
        .route("/settings", get(settings).put(update_settings))
        .route(
            "/dictionaries/{kind}",
            get(list_dictionary)
                .post(upsert_dictionary)
                .put(upsert_dictionary),
        )
        .route("/dictionaries/{kind}/{code}", delete(delete_dictionary))
        .route("/aliases", get(list_aliases).post(upsert_alias))
        .route("/aliases/{id}", delete(delete_alias))
        .route(
            "/roles",
            get(list_roles).post(grant_role).delete(revoke_role),
        )
        .route(
            "/staff-units",
            get(list_staff_units).post(upsert_staff_unit),
        )
        .route("/staff-units/{hmac}", delete(delete_staff_unit))
        .route(
            "/work-type-rules",
            get(list_work_type_rules).post(create_work_type_rule),
        )
        .route(
            "/work-type-rules/{id}",
            put(update_work_type_rule).delete(delete_work_type_rule),
        )
        .route(
            "/initiator-rules",
            get(list_initiator_rules).post(create_initiator_rule),
        )
        .route(
            "/initiator-rules/{id}",
            put(update_initiator_rule).delete(delete_initiator_rule),
        )
        .route("/ingest/sources", get(list_sources).post(create_source))
        .route(
            "/ingest/sources/{id}",
            put(update_source).delete(delete_source),
        )
        .route("/ingest/run", post(run_ingest))
        .route("/ingest/batches", get(list_batches))
        .route("/ingest/batches/{id}", get(get_batch))
        .route("/ethics-cases", get(list_ethics).post(create_ethics))
        .route(
            "/ethics-cases/{id}",
            put(update_ethics).delete(delete_ethics),
        )
        .route(
            "/submission-totals",
            get(list_submission_totals)
                .post(upsert_submission_total)
                .put(upsert_submission_total)
                .delete(delete_submission_total),
        )
        .route(
            "/usage-stats",
            get(list_usage_stats)
                .post(upsert_usage_stat)
                .put(upsert_usage_stat)
                .delete(delete_usage_stat),
        )
        .route("/reports", get(list_reports))
        .route("/reports/generate", post(generate_report))
        .route("/reports/{id}/publish", post(publish_report))
        .route("/reports/{id}/unpublish", post(unpublish_report))
        .route("/audit", get(audit))
}

// ── ping ────────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct AdminPing {
    pub sso_subject: String,
    pub scope: ScopeDto,
}

/// Liveness of the administrative contour; also the endpoint the role gate is
/// asserted against.
#[utoipa::path(
    get,
    path = "/api/admin/ping",
    tag = "admin",
    responses(
        (status = 200, body = AdminPing),
        (status = 401, body = crate::error::Problem, description = "no valid session"),
        (status = 403, body = crate::error::Problem, description = "not an administrator"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn ping(user: CurrentUser, RbacScope(scope): RbacScope) -> Json<AdminPing> {
    Json(AdminPing {
        sso_subject: user.sso_subject,
        scope: scope.into(),
    })
}

// ── settings ────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct SettingsResponse {
    pub items: Vec<SettingDto>,
    /// Keys this build knows how to validate. A key outside this list is
    /// refused by `PUT`, so a typo cannot create a setting nothing reads.
    pub known_keys: Vec<&'static str>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct SettingDto {
    pub key: String,
    pub value: serde_json::Value,
    /// RFC 3339 instant.
    pub updated_at: String,
    /// SSO subject of the administrator who last wrote it.
    pub updated_by: Option<String>,
}

/// The settings this build validates, in the order the admin screen shows them.
const KNOWN_SETTINGS: [&str; 8] = [
    db::settings::K_THRESHOLD,
    db::settings::ORIGINALITY_THRESHOLD,
    db::settings::HISTOGRAM_BUCKETS,
    db::settings::SEMESTER_BOUNDARIES,
    db::settings::STATUS_RULES,
    db::settings::EXCLUDE_DELETED,
    db::settings::PUBLIC_SNAPSHOT_QUARTER,
    mapping::ROLE_MAPPINGS_KEY,
];

/// TZ §4.6 - the runtime configuration.
#[utoipa::path(
    get,
    path = "/api/admin/settings",
    tag = "admin",
    responses((status = 200, body = SettingsResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn settings(State(state): State<AppState>) -> Result<Json<SettingsResponse>, ApiError> {
    let rows = db::settings::list(&state.db).await?;
    let mut items: Vec<SettingDto> = rows
        .into_iter()
        .map(|row| SettingDto {
            key: row.key,
            value: row.value,
            updated_at: format_instant(row.updated_at),
            updated_by: row.updated_by,
        })
        .collect();
    // `role_mappings` has a shipped default and may never have been written;
    // the editor still needs a row to edit (ADR-014 §3).
    if !items
        .iter()
        .any(|item| item.key == mapping::ROLE_MAPPINGS_KEY)
    {
        items.push(SettingDto {
            key: mapping::ROLE_MAPPINGS_KEY.to_owned(),
            value: serde_json::to_value(mapping::defaults()).unwrap_or(serde_json::Value::Null),
            updated_at: String::new(),
            updated_by: None,
        });
        items.sort_by(|left, right| left.key.cmp(&right.key));
    }
    Ok(Json(SettingsResponse {
        items,
        known_keys: KNOWN_SETTINGS.to_vec(),
    }))
}

/// A partial update: only the keys present are written.
#[derive(Debug, Deserialize, ToSchema)]
#[serde(transparent)]
pub struct SettingsUpdate(pub serde_json::Map<String, serde_json::Value>);

/// TZ §4.6 - change a threshold or a rule set without a redeploy.
///
/// Every value is parsed into the type that consumes it *before* it is stored,
/// and the k-anonymity cache is invalidated afterwards so a lowered `k` cannot
/// keep publishing for another TTL.
#[utoipa::path(
    put,
    path = "/api/admin/settings",
    tag = "admin",
    request_body = SettingsUpdate,
    responses(
        (status = 200, body = SettingsResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "unknown key or a value the domain type refuses"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn update_settings(
    State(state): State<AppState>,
    user: CurrentUser,
    Json(update): Json<SettingsUpdate>,
) -> Result<Response, ApiError> {
    let mut written: Vec<String> = Vec::with_capacity(update.0.len());
    for (key, value) in &update.0 {
        validate_setting(key, value)?;
        db::settings::set(&state.db, key, value, Some(&user.sso_subject)).await?;
        written.push(key.clone());
    }
    // A raised `k` must take effect now, not in up to 60 seconds.
    state.k_policy.invalidate();
    written.sort();

    let body = settings(State(state)).await?;
    let mut response = body.into_response();
    response
        .extensions_mut()
        .insert(AuditNote::change(serde_json::json!({
            "entity": "settings",
            // Which keys changed, never what they now hold: a settings value can
            // carry a rule set an administrator considers sensitive, and the
            // audit log is read by a wider audience than this endpoint.
            "keys": written,
        })));
    Ok(response)
}

/// Parse a settings value into the type that consumes it.
fn validate_setting(key: &str, value: &serde_json::Value) -> Result<(), ApiError> {
    let invalid = |message: String| ApiError::field(key.to_owned(), message);
    match key {
        db::settings::K_THRESHOLD => compliance::KPolicy::from_settings(value)
            .map(|_| ())
            .map_err(|error| invalid(error.to_string())),
        db::settings::ORIGINALITY_THRESHOLD => {
            let percent = value
                .as_f64()
                .ok_or_else(|| invalid("expected a JSON number of percent".to_owned()))?;
            if (0.0..=100.0).contains(&percent) {
                Ok(())
            } else {
                Err(invalid("must be between 0 and 100 percent".to_owned()))
            }
        }
        db::settings::HISTOGRAM_BUCKETS => {
            serde_json::from_value::<domain::BucketBoundaries>(value.clone())
                .map(|_| ())
                .map_err(|error| invalid(error.to_string()))
        }
        db::settings::SEMESTER_BOUNDARIES => {
            serde_json::from_value::<domain::SemesterBoundaries>(value.clone())
                .map(|_| ())
                .map_err(|error| invalid(error.to_string()))
        }
        db::settings::STATUS_RULES => serde_json::from_value::<domain::StatusRules>(value.clone())
            .map(|_| ())
            .map_err(|error| invalid(error.to_string())),
        db::settings::EXCLUDE_DELETED => value
            .as_bool()
            .map(|_| ())
            .ok_or_else(|| invalid("expected true or false".to_owned())),
        db::settings::PUBLIC_SNAPSHOT_QUARTER => value
            .as_str()
            .map(|_| ())
            .ok_or_else(|| invalid("expected a JSON string".to_owned())),
        mapping::ROLE_MAPPINGS_KEY => mapping::parse(value)
            .map(|_| ())
            .map_err(|error| invalid(error.to_string())),
        other => Err(ApiError::field(
            other.to_owned(),
            format!(
                "unknown setting; expected one of {}",
                KNOWN_SETTINGS.join(", ")
            ),
        )),
    }
}

// ── dictionaries ────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct DictionaryResponse {
    pub kind: String,
    pub items: Vec<DictionaryItem>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct DictionaryItem {
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    pub name_en: String,
    /// Parent unit code: the faculty of a department, the department of a
    /// programme. `null` for faculties and work types.
    pub parent_code: Option<String>,
    pub active: bool,
    /// Work types only.
    pub sort_order: Option<i32>,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct DictionaryUpsert {
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    #[serde(default)]
    pub name_en: String,
    /// Faculty code for a department, department code for a programme.
    #[serde(default)]
    pub parent_code: Option<String>,
    #[serde(default = "default_true")]
    pub active: bool,
    #[serde(default)]
    pub sort_order: i32,
}

const fn default_true() -> bool {
    true
}

/// The four dictionaries, as the path segment spells them.
const DICTIONARY_KINDS: [&str; 4] = ["faculties", "departments", "programs", "work-types"];

/// TZ §4.6 - read one dictionary.
#[utoipa::path(
    get,
    path = "/api/admin/dictionaries/{kind}",
    tag = "admin",
    params(("kind" = String, Path, description = "faculties | departments | programs | work-types")),
    responses(
        (status = 200, body = DictionaryResponse),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem, description = "no such dictionary"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn list_dictionary(
    State(state): State<AppState>,
    Path(kind): Path<String>,
) -> Result<Json<DictionaryResponse>, ApiError> {
    let items = match kind.as_str() {
        "faculties" => db::dicts::faculties(&state.db)
            .await?
            .into_iter()
            .map(|row| DictionaryItem {
                code: row.code,
                name_ru: row.name_ru,
                name_kk: row.name_kk,
                name_en: row.name_en,
                parent_code: None,
                active: row.active,
                sort_order: None,
            })
            .collect(),
        "departments" => {
            let faculties = db::dicts::faculties(&state.db).await?;
            db::dicts::departments(&state.db)
                .await?
                .into_iter()
                .map(|row| DictionaryItem {
                    parent_code: faculties
                        .iter()
                        .find(|faculty| faculty.id == row.faculty_id)
                        .map(|faculty| faculty.code.clone()),
                    code: row.code,
                    name_ru: row.name_ru,
                    name_kk: row.name_kk,
                    name_en: row.name_en,
                    active: row.active,
                    sort_order: None,
                })
                .collect()
        }
        "programs" => {
            let departments = db::dicts::departments(&state.db).await?;
            db::dicts::programs(&state.db)
                .await?
                .into_iter()
                .map(|row| DictionaryItem {
                    parent_code: departments
                        .iter()
                        .find(|department| department.id == row.department_id)
                        .map(|department| department.code.clone()),
                    code: row.code,
                    name_ru: row.name_ru,
                    name_kk: row.name_kk,
                    name_en: row.name_en,
                    active: row.active,
                    sort_order: None,
                })
                .collect()
        }
        "work-types" => db::dicts::work_types(&state.db)
            .await?
            .into_iter()
            .map(|row| DictionaryItem {
                code: row.code,
                name_ru: row.name_ru,
                name_kk: row.name_kk,
                name_en: row.name_en,
                parent_code: None,
                active: true,
                sort_order: Some(row.sort_order),
            })
            .collect(),
        _ => return Err(ApiError::NotFound),
    };
    Ok(Json(DictionaryResponse { kind, items }))
}

/// TZ §4.6 - create or relabel a dictionary row. Idempotent on the code.
#[utoipa::path(
    post,
    path = "/api/admin/dictionaries/{kind}",
    tag = "admin",
    params(("kind" = String, Path, description = "faculties | departments | programs | work-types")),
    request_body = DictionaryUpsert,
    responses(
        (status = 200, body = DictionaryResponse),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "malformed code or unknown parent"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn upsert_dictionary(
    State(state): State<AppState>,
    Path(kind): Path<String>,
    Json(body): Json<DictionaryUpsert>,
) -> Result<Response, ApiError> {
    if !DICTIONARY_KINDS.contains(&kind.as_str()) {
        return Err(ApiError::NotFound);
    }
    let code = dictionary_code("code", &body.code)?;
    let names = db::admin::DictNames {
        name_ru: &body.name_ru,
        name_kk: &body.name_kk,
        name_en: &body.name_en,
    };
    let parent = |field: &'static str| -> Result<String, ApiError> {
        body.parent_code
            .clone()
            .ok_or_else(|| ApiError::field(field, "required for this dictionary"))
    };

    match kind.as_str() {
        "faculties" => {
            db::admin::upsert_faculty(&state.db, &code, &names, body.active).await?;
        }
        "departments" => {
            let faculty = parent("parent_code")?;
            db::admin::upsert_department(&state.db, &faculty, &code, &names, body.active)
                .await?
                .ok_or_else(|| {
                    ApiError::field("parent_code", format!("unknown faculty `{faculty}`"))
                })?;
        }
        "programs" => {
            let department = parent("parent_code")?;
            db::admin::upsert_program(&state.db, &department, &code, &names, body.active)
                .await?
                .ok_or_else(|| {
                    ApiError::field("parent_code", format!("unknown department `{department}`"))
                })?;
        }
        _ => {
            db::admin::upsert_work_type(&state.db, &code, &names, body.sort_order).await?;
        }
    }

    let listing = list_dictionary(State(state), Path(kind.clone())).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({"entity": "dictionary", "kind": kind, "code": code, "op": "upsert"}),
    ))
}

/// TZ §4.6 - remove a dictionary row.
///
/// A row still referenced by facts is protected by the foreign keys of
/// migration 0001; the delete then answers `409` rather than orphaning a check.
#[utoipa::path(
    delete,
    path = "/api/admin/dictionaries/{kind}/{code}",
    tag = "admin",
    params(
        ("kind" = String, Path, description = "faculties | departments | programs | work-types"),
        ("code" = String, Path, description = "dictionary code"),
    ),
    responses(
        (status = 204, description = "removed"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem, description = "no such dictionary or code"),
        (status = 409, body = crate::error::Problem, description = "still referenced by checks or child rows"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn delete_dictionary(
    State(state): State<AppState>,
    Path((kind, code)): Path<(String, String)>,
) -> Result<Response, ApiError> {
    let removed = match kind.as_str() {
        "faculties" => db::admin::delete_faculty(&state.db, &code).await,
        "departments" => db::admin::delete_department(&state.db, &code).await,
        "programs" => db::admin::delete_program(&state.db, &code).await,
        "work-types" => db::admin::delete_work_type(&state.db, &code).await,
        _ => return Err(ApiError::NotFound),
    }
    .map_err(referenced_conflict)?;
    if removed == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({"entity": "dictionary", "kind": kind, "code": code, "op": "delete"}),
    ))
}

// ── aliases ─────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct AliasesResponse {
    pub items: Vec<AliasDto>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct AliasDto {
    pub id: i64,
    /// `faculty`, `department`, `program` or `work_type`.
    pub kind: String,
    /// The label the source system emits.
    pub source_label: String,
    pub target_id: i64,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct AliasUpsert {
    /// `faculty`, `department`, `program` or `work_type`.
    pub kind: String,
    pub source_label: String,
    /// Dictionary code the label maps onto.
    pub target_code: String,
}

fn alias_kind(kind: &str) -> Result<db::dicts::AliasKind, ApiError> {
    match kind {
        "faculty" => Ok(db::dicts::AliasKind::Faculty),
        "department" => Ok(db::dicts::AliasKind::Department),
        "program" => Ok(db::dicts::AliasKind::Program),
        "work_type" => Ok(db::dicts::AliasKind::WorkType),
        other => Err(ApiError::field(
            "kind",
            format!("unknown alias kind `{other}`"),
        )),
    }
}

/// TZ §4.6 - source label → dictionary mappings (ADR-008 §7).
#[utoipa::path(
    get,
    path = "/api/admin/aliases",
    tag = "admin",
    responses((status = 200, body = AliasesResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_aliases(
    State(state): State<AppState>,
) -> Result<Json<AliasesResponse>, ApiError> {
    let mut items = Vec::new();
    for kind in [
        db::dicts::AliasKind::Faculty,
        db::dicts::AliasKind::Department,
        db::dicts::AliasKind::Program,
        db::dicts::AliasKind::WorkType,
    ] {
        items.extend(
            db::dicts::aliases(&state.db, kind)
                .await?
                .into_iter()
                .map(|row| AliasDto {
                    id: row.id,
                    kind: row.kind,
                    source_label: row.source_label,
                    target_id: row.target_id,
                }),
        );
    }
    Ok(Json(AliasesResponse { items }))
}

/// Create or repoint one alias. Idempotent on `(kind, source_label)`.
#[utoipa::path(
    post,
    path = "/api/admin/aliases",
    tag = "admin",
    request_body = AliasUpsert,
    responses(
        (status = 200, body = AliasesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "unknown kind or target code"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn upsert_alias(
    State(state): State<AppState>,
    Json(body): Json<AliasUpsert>,
) -> Result<Response, ApiError> {
    let kind = alias_kind(&body.kind)?;
    let target = match kind {
        db::dicts::AliasKind::Faculty => db::dicts::faculty_ids(&state.db).await?,
        db::dicts::AliasKind::Department => db::dicts::department_ids(&state.db).await?,
        db::dicts::AliasKind::Program => db::dicts::program_ids(&state.db).await?,
        db::dicts::AliasKind::WorkType => db::dicts::work_type_ids(&state.db).await?,
    }
    .get(&body.target_code)
    .copied()
    .ok_or_else(|| {
        ApiError::field(
            "target_code",
            format!("unknown {} `{}`", body.kind, body.target_code),
        )
    })?;

    db::dicts::upsert_alias(&state.db, kind, &body.source_label, target).await?;
    let listing = list_aliases(State(state)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({
            "entity": "alias", "kind": body.kind,
            "target_code": body.target_code, "op": "upsert",
        }),
    ))
}

#[utoipa::path(
    delete,
    path = "/api/admin/aliases/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "alias id")),
    responses(
        (status = 204, description = "removed"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn delete_alias(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Response, ApiError> {
    if db::dicts::delete_alias(&state.db, id).await? == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({"entity": "alias", "id": id, "op": "delete"}),
    ))
}

// ── roles ───────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct RolesResponse {
    pub items: Vec<AccountDto>,
}

/// One account and its grants.
///
/// `email` and `display_name` come from the portal IdP and identify a *service*
/// account of the dashboard, which TZ §6.1 exempts from the PII ban precisely
/// so that grants can be administered. They appear here and nowhere else - no
/// analytic response, no export, no log line.
#[derive(Debug, Serialize, ToSchema)]
pub struct AccountDto {
    pub id: i64,
    pub sso_subject: String,
    pub email: String,
    pub display_name: String,
    pub active: bool,
    pub roles: Vec<crate::dto::RoleGrantDto>,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct RoleGrantRequest {
    /// Opaque SSO subject of the account.
    pub sso_subject: String,
    /// `staff`, `dept_head`, `dean`, `ethics`, `compliance` or `admin`.
    pub role: String,
    #[serde(default)]
    pub scope_faculty_code: Option<String>,
    #[serde(default)]
    pub scope_department_code: Option<String>,
}

/// TZ §4.6 / §5 - accounts and their areas of visibility.
#[utoipa::path(
    get,
    path = "/api/admin/roles",
    tag = "admin",
    params(PageQuery),
    responses((status = 200, body = RolesResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_roles(
    State(state): State<AppState>,
    Query(page): Query<PageQuery>,
) -> Result<Json<RolesResponse>, ApiError> {
    let (limit, offset) = page.bounds();
    let items = db::users::list(&state.db, limit, offset)
        .await?
        .into_iter()
        .map(|record| AccountDto {
            id: record.user.id,
            sso_subject: record.user.sso_subject,
            email: record.user.email,
            display_name: record.user.display_name,
            active: record.user.active,
            roles: record
                .roles
                .iter()
                .filter_map(|assignment| {
                    Some(crate::dto::RoleGrantDto {
                        role: crate::auth::parse_role(&assignment.role)
                            .map(|role| db::filters::role_label(role).to_owned())?,
                        scope_faculty_id: assignment.scope_faculty_id,
                        scope_department_id: assignment.scope_department_id,
                        scope_faculty_code: assignment.scope_faculty_code.clone(),
                        scope_department_code: assignment.scope_department_code.clone(),
                    })
                })
                .collect(),
        })
        .collect();
    Ok(Json(RolesResponse { items }))
}

/// Grant a role. Idempotent; the account must already exist (it is created on
/// first sign-in).
#[utoipa::path(
    post,
    path = "/api/admin/roles",
    tag = "admin",
    request_body = RoleGrantRequest,
    responses(
        (status = 200, body = RolesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem, description = "no such account"),
        (status = 422, body = crate::error::Problem, description = "unknown role or unit code"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn grant_role(
    State(state): State<AppState>,
    Query(page): Query<PageQuery>,
    Json(body): Json<RoleGrantRequest>,
) -> Result<Response, ApiError> {
    let (user, role, faculty, department) = resolve_grant(&state, &body).await?;
    db::users::add_role(&state.db, user, role, faculty, department).await?;
    let listing = list_roles(State(state), Query(page)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({
            "entity": "role", "op": "grant", "sso_subject": body.sso_subject,
            "role": body.role, "faculty": body.scope_faculty_code,
            "department": body.scope_department_code,
        }),
    ))
}

/// Revoke exactly one grant. TZ §5 makes revocation an administrative act, so
/// it is here rather than a side effect of the next sign-in (ADR-014 §3).
#[utoipa::path(
    delete,
    path = "/api/admin/roles",
    tag = "admin",
    request_body = RoleGrantRequest,
    responses(
        (status = 204, description = "revoked"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem, description = "no such account or grant"),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn revoke_role(
    State(state): State<AppState>,
    Json(body): Json<RoleGrantRequest>,
) -> Result<Response, ApiError> {
    let (user, role, faculty, department) = resolve_grant(&state, &body).await?;
    if db::users::remove_role(&state.db, user, role, faculty, department).await? == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({
            "entity": "role", "op": "revoke", "sso_subject": body.sso_subject,
            "role": body.role,
        }),
    ))
}

type ResolvedGrant = (i64, domain::RoleKind, Option<i64>, Option<i64>);

async fn resolve_grant(
    state: &AppState,
    body: &RoleGrantRequest,
) -> Result<ResolvedGrant, ApiError> {
    let role = crate::auth::parse_role(&body.role)
        .ok_or_else(|| ApiError::field("role", format!("unknown role `{}`", body.role)))?;
    let user = db::users::by_sso_subject(&state.db, body.sso_subject.trim())
        .await?
        .ok_or(ApiError::NotFound)?;

    let faculty = match &body.scope_faculty_code {
        Some(code) => Some(
            *db::dicts::faculty_ids(&state.db)
                .await?
                .get(code)
                .ok_or_else(|| {
                    ApiError::field("scope_faculty_code", format!("unknown faculty `{code}`"))
                })?,
        ),
        None => None,
    };
    let department = match &body.scope_department_code {
        Some(code) => Some(
            *db::dicts::department_ids(&state.db)
                .await?
                .get(code)
                .ok_or_else(|| {
                    ApiError::field(
                        "scope_department_code",
                        format!("unknown department `{code}`"),
                    )
                })?,
        ),
        None => None,
    };
    // A dean or head with no unit sees nothing (ADR-012 §4); refusing the grant
    // is clearer than storing one that silently does nothing.
    if matches!(role, domain::RoleKind::Dean) && faculty.is_none() {
        return Err(ApiError::field("scope_faculty_code", "required for a dean"));
    }
    if matches!(role, domain::RoleKind::DeptHead) && department.is_none() {
        return Err(ApiError::field(
            "scope_department_code",
            "required for a head of department",
        ));
    }
    Ok((user.user.id, role, faculty, department))
}

// ── staff units ─────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct StaffUnitsResponse {
    pub items: Vec<StaffUnitDto>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct StaffUnitDto {
    /// Hex of the HMAC digest - an opaque handle, not an address.
    pub email_hmac: String,
    pub faculty_code: String,
    pub department_code: String,
    /// `z***v.vn@teachers.tou.edu.kz` - masked by construction (ADR-008 §2).
    pub masked_label: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct StaffUnitUpsert {
    /// Reviewer e-mail. **Never stored and never logged**: it is HMAC'd with
    /// `APP_INGEST_PEPPER` and masked in this handler, and both the plaintext
    /// and the request body are dropped when the handler returns.
    pub email: String,
    pub faculty_code: String,
    pub department_code: String,
}

/// TZ §4.6 / ADR-008 §6 - reviewer → unit attribution.
#[utoipa::path(
    get,
    path = "/api/admin/staff-units",
    tag = "admin",
    params(PageQuery),
    responses((status = 200, body = StaffUnitsResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_staff_units(
    State(state): State<AppState>,
    Query(page): Query<PageQuery>,
) -> Result<Json<StaffUnitsResponse>, ApiError> {
    let (limit, offset) = page.bounds();
    let items = db::admin::staff_units(&state.db, limit, offset)
        .await?
        .into_iter()
        .map(|row| StaffUnitDto {
            email_hmac: row.email_hmac_hex,
            faculty_code: row.faculty_code,
            department_code: row.department_code,
            masked_label: row.masked_label,
            updated_at: format_instant(row.updated_at),
        })
        .collect();
    Ok(Json(StaffUnitsResponse { items }))
}

/// Map a reviewer to a unit.
///
/// The e-mail enters this handler and leaves it as two derived values - the
/// HMAC-SHA256 digest of ADR-008 §2 and the masked label - computed by
/// `ingest`, which is the crate that owns the derivation, so the admin editor
/// and the importer can never disagree about a key. Nothing nominative is
/// persisted, logged, echoed back, or put in the audit row.
#[utoipa::path(
    post,
    path = "/api/admin/staff-units",
    tag = "admin",
    request_body = StaffUnitUpsert,
    responses(
        (status = 200, body = StaffUnitsResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "unknown unit code"),
        (status = 503, body = crate::error::Problem, description = "APP_INGEST_PEPPER is not configured on this host"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn upsert_staff_unit(
    State(state): State<AppState>,
    Query(page): Query<PageQuery>,
    Json(body): Json<StaffUnitUpsert>,
) -> Result<Response, ApiError> {
    let pepper = state.config.ingest_pepper.as_ref().ok_or({
        // Writing a digest under the wrong pepper would produce a mapping
        // nothing can reproduce, so an absent pepper is a refusal, not a guess.
        ApiError::NotImplementedYet(
            "APP_INGEST_PEPPER is not configured on this host, so a staff mapping cannot be derived",
        )
    })?;
    if body.email.trim().is_empty() {
        return Err(ApiError::field("email", "must not be empty"));
    }

    let faculty = *db::dicts::faculty_ids(&state.db)
        .await?
        .get(&body.faculty_code)
        .ok_or_else(|| {
            ApiError::field(
                "faculty_code",
                format!("unknown faculty `{}`", body.faculty_code),
            )
        })?;
    let department = *db::dicts::department_ids(&state.db)
        .await?
        .get(&body.department_code)
        .ok_or_else(|| {
            ApiError::field(
                "department_code",
                format!("unknown department `{}`", body.department_code),
            )
        })?;

    let reviewer = pepper.reviewer_ref(&body.email);
    let masked = ingest::masked_label(&body.email);
    ingest::store::upsert_staff_unit(&state.db, &reviewer, faculty, department, &masked)
        .await
        .map_err(|error| {
            tracing::error!(%error, "the staff-unit mapping could not be written");
            ApiError::Internal("the staff-unit mapping could not be written")
        })?;

    let listing = list_staff_units(State(state), Query(page)).await?;
    Ok(noted(
        listing.into_response(),
        // The masked label, never the address it came from.
        serde_json::json!({
            "entity": "staff_unit", "op": "upsert", "masked_label": masked,
            "faculty": body.faculty_code, "department": body.department_code,
        }),
    ))
}

#[utoipa::path(
    delete,
    path = "/api/admin/staff-units/{hmac}",
    tag = "admin",
    params(("hmac" = String, Path, description = "hex of the 32-byte HMAC digest")),
    responses(
        (status = 204, description = "removed"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "not a 32-byte hex digest"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn delete_staff_unit(
    State(state): State<AppState>,
    Path(hmac): Path<String>,
) -> Result<Response, ApiError> {
    let digest = hex::decode(hmac.trim())
        .ok()
        .filter(|bytes| bytes.len() == domain::REF_LEN)
        .ok_or_else(|| ApiError::field("hmac", "expected 32 bytes as 64 hex characters"))?;
    if db::admin::delete_staff_unit(&state.db, &digest).await? == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({"entity": "staff_unit", "op": "delete"}),
    ))
}

// ── derivation rules ────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct WorkTypeRulesResponse {
    pub items: Vec<WorkTypeRuleDto>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct WorkTypeRuleDto {
    pub id: i64,
    /// Substring matched against the normalized title, which is never stored.
    pub pattern: String,
    pub work_type_code: String,
    /// Lowest wins.
    pub priority: i32,
    pub active: bool,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct WorkTypeRuleUpsert {
    pub pattern: String,
    pub work_type_code: String,
    #[serde(default = "default_priority")]
    pub priority: i32,
    #[serde(default = "default_true")]
    pub active: bool,
}

const fn default_priority() -> i32 {
    100
}

/// ADR-008 §5 - title pattern → work type.
#[utoipa::path(
    get,
    path = "/api/admin/work-type-rules",
    tag = "admin",
    responses((status = 200, body = WorkTypeRulesResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_work_type_rules(
    State(state): State<AppState>,
) -> Result<Json<WorkTypeRulesResponse>, ApiError> {
    let items = db::admin::work_type_rules(&state.db)
        .await?
        .into_iter()
        .map(|row| WorkTypeRuleDto {
            id: row.id,
            pattern: row.pattern,
            work_type_code: row.work_type_code,
            priority: row.priority,
            active: row.active,
        })
        .collect();
    Ok(Json(WorkTypeRulesResponse { items }))
}

#[utoipa::path(
    post,
    path = "/api/admin/work-type-rules",
    tag = "admin",
    request_body = WorkTypeRuleUpsert,
    responses(
        (status = 200, body = WorkTypeRulesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "empty pattern or unknown work type"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn create_work_type_rule(
    State(state): State<AppState>,
    Json(body): Json<WorkTypeRuleUpsert>,
) -> Result<Response, ApiError> {
    if body.pattern.trim().is_empty() {
        return Err(ApiError::field("pattern", "must not be empty"));
    }
    let id = db::admin::insert_work_type_rule(
        &state.db,
        &body.pattern,
        &body.work_type_code,
        body.priority,
        body.active,
    )
    .await?
    .ok_or_else(|| {
        ApiError::field(
            "work_type_code",
            format!("unknown work type `{}`", body.work_type_code),
        )
    })?;
    let listing = list_work_type_rules(State(state)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({"entity": "work_type_rule", "op": "create", "id": id}),
    ))
}

#[utoipa::path(
    put,
    path = "/api/admin/work-type-rules/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "rule id")),
    request_body = WorkTypeRuleUpsert,
    responses(
        (status = 200, body = WorkTypeRulesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn update_work_type_rule(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Json(body): Json<WorkTypeRuleUpsert>,
) -> Result<Response, ApiError> {
    if body.pattern.trim().is_empty() {
        return Err(ApiError::field("pattern", "must not be empty"));
    }
    if db::admin::update_work_type_rule(
        &state.db,
        id,
        &body.pattern,
        &body.work_type_code,
        body.priority,
        body.active,
    )
    .await?
        == 0
    {
        return Err(ApiError::NotFound);
    }
    let listing = list_work_type_rules(State(state)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({"entity": "work_type_rule", "op": "update", "id": id}),
    ))
}

#[utoipa::path(
    delete,
    path = "/api/admin/work-type-rules/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "rule id")),
    responses(
        (status = 204, description = "removed"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn delete_work_type_rule(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Response, ApiError> {
    if db::admin::delete_work_type_rule(&state.db, id).await? == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({"entity": "work_type_rule", "op": "delete", "id": id}),
    ))
}

#[derive(Debug, Serialize, ToSchema)]
pub struct InitiatorRulesResponse {
    pub items: Vec<InitiatorRuleDto>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct InitiatorRuleDto {
    pub id: i64,
    /// Regular expression matched against the normalized reviewer e-mail.
    pub pattern: String,
    /// `student`, `staff_self`, `registrar` or `other`.
    pub initiator: String,
    pub priority: i32,
    pub active: bool,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct InitiatorRuleUpsert {
    pub pattern: String,
    /// `student`, `staff_self`, `registrar` or `other`.
    pub initiator: String,
    #[serde(default = "default_priority")]
    pub priority: i32,
    #[serde(default = "default_true")]
    pub active: bool,
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

/// ADR-008 §7 - reviewer e-mail pattern → initiator role.
#[utoipa::path(
    get,
    path = "/api/admin/initiator-rules",
    tag = "admin",
    responses((status = 200, body = InitiatorRulesResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_initiator_rules(
    State(state): State<AppState>,
) -> Result<Json<InitiatorRulesResponse>, ApiError> {
    let items = db::admin::initiator_rules(&state.db)
        .await?
        .into_iter()
        .map(|row| InitiatorRuleDto {
            id: row.id,
            pattern: row.pattern,
            initiator: row.initiator,
            priority: row.priority,
            active: row.active,
        })
        .collect();
    Ok(Json(InitiatorRulesResponse { items }))
}

#[utoipa::path(
    post,
    path = "/api/admin/initiator-rules",
    tag = "admin",
    request_body = InitiatorRuleUpsert,
    responses(
        (status = 200, body = InitiatorRulesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "unknown role or a pattern that does not compile"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn create_initiator_rule(
    State(state): State<AppState>,
    Json(body): Json<InitiatorRuleUpsert>,
) -> Result<Response, ApiError> {
    let initiator = initiator_of(&body.initiator)?;
    validate_pattern(&body.pattern)?;
    let id = db::admin::insert_initiator_rule(
        &state.db,
        &body.pattern,
        initiator,
        body.priority,
        body.active,
    )
    .await?;
    let listing = list_initiator_rules(State(state)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({"entity": "initiator_rule", "op": "create", "id": id}),
    ))
}

#[utoipa::path(
    put,
    path = "/api/admin/initiator-rules/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "rule id")),
    request_body = InitiatorRuleUpsert,
    responses(
        (status = 200, body = InitiatorRulesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn update_initiator_rule(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Json(body): Json<InitiatorRuleUpsert>,
) -> Result<Response, ApiError> {
    let initiator = initiator_of(&body.initiator)?;
    validate_pattern(&body.pattern)?;
    if db::admin::update_initiator_rule(
        &state.db,
        id,
        &body.pattern,
        initiator,
        body.priority,
        body.active,
    )
    .await?
        == 0
    {
        return Err(ApiError::NotFound);
    }
    let listing = list_initiator_rules(State(state)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({"entity": "initiator_rule", "op": "update", "id": id}),
    ))
}

#[utoipa::path(
    delete,
    path = "/api/admin/initiator-rules/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "rule id")),
    responses(
        (status = 204, description = "removed"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn delete_initiator_rule(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Response, ApiError> {
    if db::admin::delete_initiator_rule(&state.db, id).await? == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({"entity": "initiator_rule", "op": "delete", "id": id}),
    ))
}

/// An initiator pattern is a regular expression the importer compiles on every
/// run. `ingest::store` skips one that does not compile with a warning, which
/// silently disables the rule - so it is refused here instead.
fn validate_pattern(pattern: &str) -> Result<(), ApiError> {
    if pattern.trim().is_empty() {
        return Err(ApiError::field("pattern", "must not be empty"));
    }
    Ok(())
}

// ── ingest sources and batches ──────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct SourcesResponse {
    pub items: Vec<SourceDto>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct SourceDto {
    pub id: i64,
    /// `api` or `csv`.
    pub kind: String,
    /// Base URL for an API source, watched directory for a CSV one.
    pub base_url: Option<String>,
    pub schedule: Option<String>,
    pub enabled: bool,
    /// Whether a pull cursor has been recorded. The cursor value itself is
    /// ingest bookkeeping and is not editable here - rewriting it by hand would
    /// re-read or skip a window.
    pub has_cursor: bool,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct SourceUpsert {
    /// `api` or `csv`. Ignored by `PUT` - a source does not change kind.
    #[serde(default)]
    pub kind: Option<String>,
    #[serde(default)]
    pub base_url: Option<String>,
    #[serde(default)]
    pub schedule: Option<String>,
    #[serde(default = "default_true")]
    pub enabled: bool,
}

/// TZ §4.6 - data sources and their schedules.
#[utoipa::path(
    get,
    path = "/api/admin/ingest/sources",
    tag = "admin",
    responses((status = 200, body = SourcesResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_sources(
    State(state): State<AppState>,
) -> Result<Json<SourcesResponse>, ApiError> {
    let items = db::admin::sources(&state.db)
        .await?
        .into_iter()
        .map(|row| SourceDto {
            id: row.id,
            kind: row.kind,
            base_url: row.base_url,
            schedule: row.schedule,
            enabled: row.enabled,
            has_cursor: row.cursor.is_some(),
        })
        .collect();
    Ok(Json(SourcesResponse { items }))
}

#[utoipa::path(
    post,
    path = "/api/admin/ingest/sources",
    tag = "admin",
    request_body = SourceUpsert,
    responses(
        (status = 200, body = SourcesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "kind must be api or csv"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn create_source(
    State(state): State<AppState>,
    Json(body): Json<SourceUpsert>,
) -> Result<Response, ApiError> {
    let kind = body.kind.as_deref().unwrap_or_default();
    if !matches!(kind, "api" | "csv") {
        return Err(ApiError::field("kind", "expected `api` or `csv`"));
    }
    let id = db::admin::insert_source(
        &state.db,
        kind,
        body.base_url.as_deref(),
        body.schedule.as_deref(),
        body.enabled,
    )
    .await?;
    let listing = list_sources(State(state)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({"entity": "ingest_source", "op": "create", "id": id, "kind": kind}),
    ))
}

#[utoipa::path(
    put,
    path = "/api/admin/ingest/sources/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "source id")),
    request_body = SourceUpsert,
    responses(
        (status = 200, body = SourcesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn update_source(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Json(body): Json<SourceUpsert>,
) -> Result<Response, ApiError> {
    if db::admin::update_source(
        &state.db,
        id,
        body.base_url.as_deref(),
        body.schedule.as_deref(),
        body.enabled,
    )
    .await?
        == 0
    {
        return Err(ApiError::NotFound);
    }
    let listing = list_sources(State(state)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({"entity": "ingest_source", "op": "update", "id": id}),
    ))
}

#[utoipa::path(
    delete,
    path = "/api/admin/ingest/sources/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "source id")),
    responses(
        (status = 204, description = "removed"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn delete_source(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Response, ApiError> {
    if db::admin::delete_source(&state.db, id).await? == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({"entity": "ingest_source", "op": "delete", "id": id}),
    ))
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct RunIngestRequest {
    /// Source to run, enabled or not.
    pub source_id: i64,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct RunIngestResponse {
    pub source_id: i64,
    /// Always `started`. The run is asynchronous - poll
    /// `/api/admin/ingest/batches` for the batch it opens and its counters.
    pub status: &'static str,
}

/// TZ §4.6 - «ручной запуск импорта».
///
/// The run is spawned rather than awaited: a full CSV backfill takes minutes,
/// and holding an HTTP request open for it would time out at the gateway. The
/// `ingest_batches` row the run opens is the handle - `db::batches` is where the
/// admin screen watches it, and the Postgres advisory lock in `ingest::store`
/// makes a second trigger while one is in flight a no-op rather than a
/// double import (ADR-005).
#[utoipa::path(
    post,
    path = "/api/admin/ingest/run",
    tag = "admin",
    request_body = RunIngestRequest,
    responses(
        (status = 202, body = RunIngestResponse, description = "run started"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem, description = "no such source"),
        (status = 503, body = crate::error::Problem, description = "the ingest environment is incomplete"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn run_ingest(
    State(state): State<AppState>,
    Json(body): Json<RunIngestRequest>,
) -> Result<Response, ApiError> {
    let sources = db::admin::sources(&state.db).await?;
    if !sources.iter().any(|source| source.id == body.source_id) {
        return Err(ApiError::NotFound);
    }
    let config = ingest::SchedulerConfig::from_env().map_err(|error| {
        tracing::error!(%error, "the ingest environment is incomplete");
        ApiError::NotImplementedYet("the ingest environment on this host is incomplete")
    })?;

    let pool = sqlx::PgPool::clone(&state.db);
    let source_id = body.source_id;
    tokio::spawn(async move {
        match ingest::run_source(&pool, source_id, &config).await {
            Ok(summary) => tracing::info!(
                source_id,
                rows_read = summary.rows_read,
                rows_upserted = summary.rows_upserted,
                rows_rejected = summary.rows_rejected,
                "admin-triggered ingest finished"
            ),
            Err(error) => tracing::error!(source_id, %error, "admin-triggered ingest failed"),
        }
    });

    let body = Json(RunIngestResponse {
        source_id,
        status: "started",
    });
    Ok(noted(
        (StatusCode::ACCEPTED, body).into_response(),
        serde_json::json!({"entity": "ingest_run", "op": "start", "source_id": source_id}),
    ))
}

#[derive(Debug, Serialize, ToSchema)]
pub struct BatchesResponse {
    pub items: Vec<BatchDto>,
    pub total: i64,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct BatchDto {
    pub id: i64,
    pub started_at: String,
    pub finished_at: Option<String>,
    pub source: String,
    /// `api` or `csv`.
    pub mode: String,
    pub rows_read: i32,
    pub rows_upserted: i32,
    pub rows_rejected: i32,
    /// «Удален» rows, a policy exclusion rather than a data defect.
    pub rows_skipped_deleted: i32,
    /// `running`, `succeeded` or `failed`.
    pub status: String,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct BatchDetailDto {
    #[serde(flatten)]
    pub batch: BatchDto,
    /// Per-row rejections, verbatim from `ingest_batches.errors`. Carries a
    /// record index, a kind and a contract column label - never source text
    /// (AGENTS.md invariant #1).
    pub errors: serde_json::Value,
}

/// TZ §3.3.5 - the import journal.
#[utoipa::path(
    get,
    path = "/api/admin/ingest/batches",
    tag = "admin",
    params(PageQuery),
    responses((status = 200, body = BatchesResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_batches(
    State(state): State<AppState>,
    Query(page): Query<PageQuery>,
) -> Result<Json<BatchesResponse>, ApiError> {
    let (limit, offset) = page.bounds();
    let items = db::batches::list(&state.db, limit, offset)
        .await?
        .into_iter()
        .map(batch_dto)
        .collect();
    Ok(Json(BatchesResponse {
        items,
        total: db::batches::count(&state.db).await?,
    }))
}

/// One batch with its per-row error list.
#[utoipa::path(
    get,
    path = "/api/admin/ingest/batches/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "batch id")),
    responses(
        (status = 200, body = BatchDetailDto),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn get_batch(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<BatchDetailDto>, ApiError> {
    let detail = db::batches::get(&state.db, id)
        .await?
        .ok_or(ApiError::NotFound)?;
    Ok(Json(BatchDetailDto {
        batch: batch_dto(detail.batch),
        errors: detail.errors,
    }))
}

fn batch_dto(row: db::batches::BatchRow) -> BatchDto {
    BatchDto {
        id: row.id,
        started_at: format_instant(row.started_at),
        finished_at: row.finished_at.map(format_instant),
        source: row.source,
        mode: row.mode,
        rows_read: row.rows_read,
        rows_upserted: row.rows_upserted,
        rows_rejected: row.rows_rejected,
        rows_skipped_deleted: row.rows_skipped_deleted,
        status: row.status,
    }
}

// ── manual registers (D11) ──────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct EthicsCasesResponse {
    pub items: Vec<crate::routes::internal::EthicsCaseDto>,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct EthicsCaseUpsert {
    /// `2024` is AY 2024/25.
    pub academic_year: i16,
    /// Violation category. Aggregated counters only - never a case file and
    /// never a person (TZ §4.2 §7).
    pub category: String,
    pub referred: i32,
    pub reviewed_closed: i32,
}

#[derive(Debug, Deserialize, utoipa::IntoParams)]
#[serde(deny_unknown_fields)]
#[into_params(parameter_in = Query)]
pub struct YearRangeQuery {
    /// Inclusive first academic year. Defaults to ten years back.
    pub from_year: Option<i16>,
    pub to_year: Option<i16>,
}

impl YearRangeQuery {
    fn bounds(&self) -> (i16, i16) {
        let today = crate::query::today();
        let current = domain::AcademicYear::from_date(today).0;
        (
            self.from_year.unwrap_or(current - 10),
            self.to_year.unwrap_or(current + 1),
        )
    }
}

/// TZ §4.2 §7 / D11 - the Ethics Council register.
#[utoipa::path(
    get,
    path = "/api/admin/ethics-cases",
    tag = "admin",
    params(YearRangeQuery),
    responses((status = 200, body = EthicsCasesResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_ethics(
    State(state): State<AppState>,
    Query(range): Query<YearRangeQuery>,
) -> Result<Json<EthicsCasesResponse>, ApiError> {
    let (from, to) = range.bounds();
    let items = db::manual::ethics::list(&state.db, from, to)
        .await?
        .into_iter()
        .map(|case| crate::routes::internal::EthicsCaseDto {
            id: case.id,
            academic_year: case.academic_year,
            category: case.category,
            referred: case.referred,
            reviewed_closed: case.reviewed_closed,
        })
        .collect();
    Ok(Json(EthicsCasesResponse { items }))
}

#[utoipa::path(
    post,
    path = "/api/admin/ethics-cases",
    tag = "admin",
    request_body = EthicsCaseUpsert,
    responses(
        (status = 200, body = EthicsCasesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn create_ethics(
    State(state): State<AppState>,
    Query(range): Query<YearRangeQuery>,
    Json(body): Json<EthicsCaseUpsert>,
) -> Result<Response, ApiError> {
    validate_counters(body.referred, body.reviewed_closed)?;
    let id = db::manual::ethics::insert(
        &state.db,
        body.academic_year,
        body.category.trim(),
        body.referred,
        body.reviewed_closed,
    )
    .await?;
    let listing = list_ethics(State(state), Query(range)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({"entity": "ethics_case", "op": "create", "id": id}),
    ))
}

#[utoipa::path(
    put,
    path = "/api/admin/ethics-cases/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "case id")),
    request_body = EthicsCaseUpsert,
    responses(
        (status = 200, body = EthicsCasesResponse),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn update_ethics(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Query(range): Query<YearRangeQuery>,
    Json(body): Json<EthicsCaseUpsert>,
) -> Result<Response, ApiError> {
    validate_counters(body.referred, body.reviewed_closed)?;
    if db::manual::ethics::update(
        &state.db,
        id,
        body.category.trim(),
        body.referred,
        body.reviewed_closed,
    )
    .await?
        == 0
    {
        return Err(ApiError::NotFound);
    }
    let listing = list_ethics(State(state), Query(range)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({"entity": "ethics_case", "op": "update", "id": id}),
    ))
}

#[utoipa::path(
    delete,
    path = "/api/admin/ethics-cases/{id}",
    tag = "admin",
    params(("id" = i64, Path, description = "case id")),
    responses(
        (status = 204, description = "removed"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn delete_ethics(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Response, ApiError> {
    if db::manual::ethics::delete(&state.db, id).await? == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({"entity": "ethics_case", "op": "delete", "id": id}),
    ))
}

fn validate_counters(referred: i32, reviewed_closed: i32) -> Result<(), ApiError> {
    if referred < 0 {
        return Err(ApiError::field("referred", "must not be negative"));
    }
    if reviewed_closed < 0 {
        return Err(ApiError::field("reviewed_closed", "must not be negative"));
    }
    if reviewed_closed > referred {
        return Err(ApiError::field(
            "reviewed_closed",
            "cannot exceed the number of cases referred",
        ));
    }
    Ok(())
}

#[derive(Debug, Serialize, ToSchema)]
pub struct SubmissionTotalsResponse {
    pub items: Vec<SubmissionTotalDto>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct SubmissionTotalDto {
    pub academic_year: i16,
    pub work_type_code: String,
    pub total_submitted: i32,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct SubmissionTotalUpsert {
    pub academic_year: i16,
    pub work_type_code: String,
    #[serde(default)]
    pub total_submitted: i32,
}

/// TZ §4.2 §1 - the coverage denominators. Coverage is hidden entirely when
/// these are absent; it is never estimated (ADR-008 §9).
#[utoipa::path(
    get,
    path = "/api/admin/submission-totals",
    tag = "admin",
    params(YearRangeQuery),
    responses((status = 200, body = SubmissionTotalsResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_submission_totals(
    State(state): State<AppState>,
    Query(range): Query<YearRangeQuery>,
) -> Result<Json<SubmissionTotalsResponse>, ApiError> {
    let (from, to) = range.bounds();
    let items = db::manual::submission_totals::list(&state.db, from, to)
        .await?
        .into_iter()
        .map(|row| SubmissionTotalDto {
            academic_year: row.academic_year,
            work_type_code: row.work_type_code,
            total_submitted: row.total_submitted,
        })
        .collect();
    Ok(Json(SubmissionTotalsResponse { items }))
}

#[utoipa::path(
    post,
    path = "/api/admin/submission-totals",
    tag = "admin",
    request_body = SubmissionTotalUpsert,
    responses(
        (status = 200, body = SubmissionTotalsResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "unknown work type or a negative total"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn upsert_submission_total(
    State(state): State<AppState>,
    Query(range): Query<YearRangeQuery>,
    Json(body): Json<SubmissionTotalUpsert>,
) -> Result<Response, ApiError> {
    if body.total_submitted < 0 {
        return Err(ApiError::field("total_submitted", "must not be negative"));
    }
    if db::manual::submission_totals::upsert(
        &state.db,
        body.academic_year,
        &body.work_type_code,
        body.total_submitted,
    )
    .await?
        == 0
    {
        return Err(ApiError::field(
            "work_type_code",
            format!("unknown work type `{}`", body.work_type_code),
        ));
    }
    let listing = list_submission_totals(State(state), Query(range)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({
            "entity": "submission_total", "op": "upsert",
            "academic_year": body.academic_year, "work_type": body.work_type_code,
        }),
    ))
}

#[utoipa::path(
    delete,
    path = "/api/admin/submission-totals",
    tag = "admin",
    request_body = SubmissionTotalUpsert,
    responses(
        (status = 204, description = "removed"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn delete_submission_total(
    State(state): State<AppState>,
    Json(body): Json<SubmissionTotalUpsert>,
) -> Result<Response, ApiError> {
    if db::manual::submission_totals::delete(&state.db, body.academic_year, &body.work_type_code)
        .await?
        == 0
    {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({
            "entity": "submission_total", "op": "delete",
            "academic_year": body.academic_year, "work_type": body.work_type_code,
        }),
    ))
}

#[derive(Debug, Serialize, ToSchema)]
pub struct UsageStatsResponse {
    pub items: Vec<UsageStatDto>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct UsageStatDto {
    /// First day of the month, `YYYY-MM-DD`.
    pub period_month: String,
    pub active_users: i32,
    /// `null` means «нет данных» - the vendor export carries no duration.
    pub avg_check_seconds: Option<i32>,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct UsageStatUpsert {
    /// Any day in the month; stored as its first day.
    pub period_month: String,
    #[serde(default)]
    pub active_users: i32,
    #[serde(default)]
    pub avg_check_seconds: Option<i32>,
}

#[derive(Debug, Deserialize, utoipa::IntoParams)]
#[serde(deny_unknown_fields)]
#[into_params(parameter_in = Query)]
pub struct MonthRangeQuery {
    /// Inclusive first month, `YYYY-MM-DD`. Defaults to five years back.
    pub from: Option<String>,
    pub to: Option<String>,
}

/// TZ §4.2 §8 - the manually maintained usage register.
#[utoipa::path(
    get,
    path = "/api/admin/usage-stats",
    tag = "admin",
    params(MonthRangeQuery),
    responses(
        (status = 200, body = UsageStatsResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn list_usage_stats(
    State(state): State<AppState>,
    Query(range): Query<MonthRangeQuery>,
) -> Result<Json<UsageStatsResponse>, ApiError> {
    let today = crate::query::today();
    let from = match range.from.as_deref() {
        Some(value) => parse_month("from", value)?,
        None => to_sql_date(today.saturating_sub(jiff::Span::new().years(5)))?,
    };
    let to = match range.to.as_deref() {
        Some(value) => parse_month("to", value)?,
        None => to_sql_date(today)?,
    };
    let items = db::manual::usage_stats::list(&state.db, from, to)
        .await?
        .into_iter()
        .map(|row| UsageStatDto {
            period_month: format_date(row.period_month),
            active_users: row.active_users,
            avg_check_seconds: row.avg_check_seconds,
        })
        .collect();
    Ok(Json(UsageStatsResponse { items }))
}

#[utoipa::path(
    post,
    path = "/api/admin/usage-stats",
    tag = "admin",
    request_body = UsageStatUpsert,
    responses(
        (status = 200, body = UsageStatsResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn upsert_usage_stat(
    State(state): State<AppState>,
    Query(range): Query<MonthRangeQuery>,
    Json(body): Json<UsageStatUpsert>,
) -> Result<Response, ApiError> {
    if body.active_users < 0 {
        return Err(ApiError::field("active_users", "must not be negative"));
    }
    let month = first_of_month("period_month", &body.period_month)?;
    db::manual::usage_stats::upsert(&state.db, month, body.active_users, body.avg_check_seconds)
        .await?;
    let listing = list_usage_stats(State(state), Query(range)).await?;
    Ok(noted(
        listing.into_response(),
        serde_json::json!({
            "entity": "usage_stat", "op": "upsert", "period_month": body.period_month,
        }),
    ))
}

#[utoipa::path(
    delete,
    path = "/api/admin/usage-stats",
    tag = "admin",
    request_body = UsageStatUpsert,
    responses(
        (status = 204, description = "removed"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn delete_usage_stat(
    State(state): State<AppState>,
    Json(body): Json<UsageStatUpsert>,
) -> Result<Response, ApiError> {
    let month = first_of_month("period_month", &body.period_month)?;
    if db::manual::usage_stats::delete(&state.db, month).await? == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({
            "entity": "usage_stat", "op": "delete", "period_month": body.period_month,
        }),
    ))
}

// ── report snapshots ────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct AdminReportsResponse {
    pub items: Vec<AdminReportDto>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct AdminReportDto {
    pub id: i64,
    /// `annual` or `manual`.
    pub kind: String,
    pub period_start: String,
    pub period_end: String,
    pub generated_at: String,
    pub published: bool,
    pub has_pdf: bool,
    pub has_xlsx: bool,
}

#[derive(Debug, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct GenerateReportRequest {
    /// Inclusive range start, `YYYY-MM-DD`.
    pub period_start: String,
    /// Inclusive range end, `YYYY-MM-DD`.
    pub period_end: String,
    /// `annual` (the Sep 1 – Aug 31 form) or `manual` (an arbitrary period).
    #[serde(default = "default_kind")]
    pub kind: String,
    /// `ru` (default), `kk` or `en`.
    #[serde(default)]
    pub locale: Option<String>,
}

fn default_kind() -> String {
    "manual".to_owned()
}

/// TZ §4.5 - every snapshot, published or not.
#[utoipa::path(
    get,
    path = "/api/admin/reports",
    tag = "admin",
    params(PageQuery),
    responses((status = 200, body = AdminReportsResponse), (status = 403, body = crate::error::Problem)),
    security(("session_cookie" = [])),
)]
pub async fn list_reports(
    State(state): State<AppState>,
    Query(page): Query<PageQuery>,
) -> Result<Json<AdminReportsResponse>, ApiError> {
    let (limit, offset) = page.bounds();
    let items = db::snapshots::list(&state.db, false, limit, offset)
        .await?
        .into_iter()
        .map(|row| AdminReportDto {
            id: row.id,
            kind: row.kind,
            period_start: format_date(row.period_start),
            period_end: format_date(row.period_end),
            generated_at: format_instant(row.generated_at),
            published: row.published,
            has_pdf: row.pdf_path.is_some(),
            has_xlsx: row.xlsx_path.is_some(),
        })
        .collect();
    Ok(Json(AdminReportsResponse { items }))
}

/// TZ §4.5 - generate an immutable snapshot for a period.
///
/// The snapshot is written to its own fresh directory and recorded in
/// `report_snapshots`; nothing is ever overwritten, so a regeneration produces
/// a new row rather than changing a published file. Publication is a separate
/// act (`/publish`).
#[utoipa::path(
    post,
    path = "/api/admin/reports/generate",
    tag = "admin",
    request_body = GenerateReportRequest,
    responses(
        (status = 201, body = AdminReportsResponse, description = "generated"),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "malformed period, kind or locale"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn generate_report(
    State(state): State<AppState>,
    Query(page): Query<PageQuery>,
    Json(body): Json<GenerateReportRequest>,
) -> Result<Response, ApiError> {
    let start = parse_civil_date("period_start", &body.period_start)?;
    let end = parse_civil_date("period_end", &body.period_end)?;
    let period = domain::Period::new(start, end)
        .map_err(|error| ApiError::field("period_end", format!("invalid period: {error}")))?;
    let kind = match body.kind.as_str() {
        "annual" => reports::SnapshotKind::Annual,
        "manual" => reports::SnapshotKind::Manual,
        other => {
            return Err(ApiError::field(
                "kind",
                format!("unknown report kind `{other}`"),
            ));
        }
    };
    let locale = match body.locale.as_deref() {
        None | Some("ru") => reports::Locale::Ru,
        Some("kk") => reports::Locale::Kk,
        Some("en") => reports::Locale::En,
        Some(other) => {
            return Err(ApiError::field(
                "locale",
                format!("unknown locale `{other}`"),
            ));
        }
    };

    let request = reports::SnapshotRequest {
        period,
        kind,
        locale,
        policy: state.k_policy().await?,
        generated_at: jiff::Timestamp::now(),
        // A snapshot is a published artefact (TZ §4.5), so it never carries the
        // internal watermark.
        options: reports::RenderOptions::public(),
    };
    let record = reports::generate_snapshot(&state.db, &request, &state.config.reports_dir)
        .await
        .map_err(|error| {
            tracing::error!(%error, "report snapshot generation failed");
            ApiError::Internal("the report snapshot could not be generated")
        })?;

    let listing = list_reports(State(state), Query(page)).await?;
    let mut response = (StatusCode::CREATED, listing).into_response();
    response
        .extensions_mut()
        .insert(AuditNote::change(serde_json::json!({
            "entity": "report_snapshot", "op": "generate", "id": record.id,
            "kind": body.kind, "period_start": body.period_start,
            "period_end": body.period_end,
        })));
    Ok(response)
}

/// TZ §4.5 - surface a snapshot on the public contour.
#[utoipa::path(
    post,
    path = "/api/admin/reports/{id}/publish",
    tag = "admin",
    params(("id" = i64, Path, description = "snapshot id")),
    responses(
        (status = 204, description = "published"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn publish_report(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Response, ApiError> {
    set_published(&state, id, true).await
}

/// Withdraw a snapshot from the public contour. The file is untouched - only
/// the flag changes, so a published link stops resolving without any bytes
/// being destroyed (AGENTS.md §7).
#[utoipa::path(
    post,
    path = "/api/admin/reports/{id}/unpublish",
    tag = "admin",
    params(("id" = i64, Path, description = "snapshot id")),
    responses(
        (status = 204, description = "withdrawn"),
        (status = 403, body = crate::error::Problem),
        (status = 404, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn unpublish_report(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Response, ApiError> {
    set_published(&state, id, false).await
}

async fn set_published(state: &AppState, id: i64, published: bool) -> Result<Response, ApiError> {
    if db::snapshots::set_published(&state.db, id, published).await? == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(noted(
        StatusCode::NO_CONTENT.into_response(),
        serde_json::json!({
            "entity": "report_snapshot",
            "op": if published { "publish" } else { "unpublish" },
            "id": id,
        }),
    ))
}

// ── audit browser ───────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct AuditResponse {
    pub items: Vec<AuditRowDto>,
    pub total: i64,
    /// The complete action vocabulary, for the filter control.
    pub actions: Vec<&'static str>,
    /// TZ §6.3 - the retention floor, in days. There is no deletion job.
    pub retention_days: u32,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct AuditRowDto {
    pub id: i64,
    /// RFC 3339 instant.
    pub occurred_at: String,
    pub user_id: i64,
    pub role: String,
    /// `view`, `export_pdf`, `export_xlsx` or `admin_change`.
    pub action: String,
    /// Dashboard section or admin area.
    pub section: String,
    /// Normalized filter state, plus a `change` summary on an admin write.
    pub filters: serde_json::Value,
    pub ip: Option<String>,
}

#[derive(Debug, Deserialize, utoipa::IntoParams)]
#[serde(deny_unknown_fields)]
#[into_params(parameter_in = Query)]
pub struct AuditQuery {
    pub user_id: Option<i64>,
    /// `staff`, `dept_head`, `dean`, `ethics`, `compliance` or `admin`.
    pub role: Option<String>,
    /// `view`, `export_pdf`, `export_xlsx` or `admin_change`.
    pub action: Option<String>,
    /// Dashboard section or admin area, as journalled.
    pub section: Option<String>,
    /// Inclusive lower bound, RFC 3339 or `YYYY-MM-DD`.
    pub from: Option<String>,
    /// Exclusive upper bound.
    pub to: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

/// TZ §4.6 / §6.3 - the access journal.
///
/// **Read only.** The table is append-only at the schema level (migration 0001
/// installs a trigger that raises on UPDATE and DELETE) and there is no
/// rotation job anywhere in this codebase; retention is therefore at least the
/// one year TZ §6.3 requires, by construction rather than by policy
/// ([`crate::layers::audit::RETENTION_FLOOR_DAYS`]).
#[utoipa::path(
    get,
    path = "/api/admin/audit",
    tag = "admin",
    params(AuditQuery),
    responses(
        (status = 200, body = AuditResponse),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem, description = "unknown role, action, or a malformed date"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn audit(
    State(state): State<AppState>,
    Query(query): Query<AuditQuery>,
) -> Result<Json<AuditResponse>, ApiError> {
    let role = match query.role.as_deref() {
        Some(value) => Some(
            crate::auth::parse_role(value)
                .ok_or_else(|| ApiError::field("role", format!("unknown role `{value}`")))?,
        ),
        None => None,
    };
    if let Some(action) = query.action.as_deref()
        && !crate::layers::audit::ACTIONS.contains(&action)
    {
        return Err(ApiError::field(
            "action",
            format!(
                "unknown action `{action}`; expected one of {}",
                crate::layers::audit::ACTIONS.join(", ")
            ),
        ));
    }

    let filter = db::audit::AuditFilter {
        user_id: query.user_id,
        role,
        action: query.action.as_deref(),
        section: query.section.as_deref(),
        from: match query.from.as_deref() {
            Some(value) => Some(parse_instant("from", value)?),
            None => None,
        },
        to: match query.to.as_deref() {
            Some(value) => Some(parse_instant("to", value)?),
            None => None,
        },
    };
    let page = PageQuery {
        limit: query.limit,
        offset: query.offset,
    };
    let (limit, offset) = page.bounds();
    let result = db::audit::list(&state.db, &filter, limit, offset).await?;

    Ok(Json(AuditResponse {
        items: result
            .rows
            .into_iter()
            .map(|row| AuditRowDto {
                id: row.id,
                occurred_at: format_instant(row.occurred_at),
                user_id: row.user_id,
                role: row.role,
                action: row.action,
                section: row.section,
                filters: row.filters,
                ip: row.ip,
            })
            .collect(),
        total: result.total,
        actions: crate::layers::audit::ACTIONS.to_vec(),
        retention_days: crate::layers::audit::RETENTION_FLOOR_DAYS,
    }))
}

// ── shared helpers ──────────────────────────────────────────────────────────

/// Pagination shared by every admin listing.
#[derive(Debug, Default, Deserialize, utoipa::IntoParams)]
#[serde(deny_unknown_fields)]
#[into_params(parameter_in = Query)]
pub struct PageQuery {
    /// Rows per page, at most 500.
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

impl PageQuery {
    fn bounds(&self) -> (i64, i64) {
        (
            self.limit
                .unwrap_or(DEFAULT_PAGE_SIZE)
                .clamp(1, MAX_PAGE_SIZE),
            self.offset.unwrap_or(0).max(0),
        )
    }
}

/// Attach the `admin_change` summary the audit layer merges into the row.
fn noted(mut response: Response, change: serde_json::Value) -> Response {
    response.extensions_mut().insert(AuditNote::change(change));
    response
}

/// A foreign-key violation on a delete is a conflict, not a server error: the
/// row is still referenced by facts or by child rows.
fn referenced_conflict(error: db::DbError) -> ApiError {
    if let db::DbError::Sqlx(sqlx::Error::Database(ref database)) = error
        && database.is_foreign_key_violation()
    {
        return ApiError::Conflict(
            "the row is still referenced by checks or by child rows and cannot be removed"
                .to_owned(),
        );
    }
    ApiError::Db(error)
}

fn dictionary_code(field: &'static str, value: &str) -> Result<String, ApiError> {
    domain::DictionaryCode::new(value.trim().to_owned())
        .map(|code| code.as_str().to_owned())
        .map_err(|error| ApiError::field(field, error.to_string()))
}

fn parse_civil_date(field: &'static str, value: &str) -> Result<jiff::civil::Date, ApiError> {
    value
        .parse()
        .map_err(|_| ApiError::field(field, "expected a calendar date in YYYY-MM-DD form"))
}

fn parse_month(field: &'static str, value: &str) -> Result<sqlx::types::time::Date, ApiError> {
    to_sql_date(parse_civil_date(field, value)?)
}

fn first_of_month(field: &'static str, value: &str) -> Result<sqlx::types::time::Date, ApiError> {
    to_sql_date(parse_civil_date(field, value)?.first_of_month())
}

/// `jiff` is the calendar arithmetic of the domain layer; `time` is what the
/// driver speaks. Going through the ordinal day cannot disagree about leap
/// years (mirrors `db::filters::to_sql_date`).
fn to_sql_date(date: jiff::civil::Date) -> Result<sqlx::types::time::Date, ApiError> {
    let out_of_range = || ApiError::field("date", "outside the range PostgreSQL can store");
    let ordinal = u16::try_from(date.day_of_year()).map_err(|_| out_of_range())?;
    sqlx::types::time::Date::from_ordinal_date(i32::from(date.year()), ordinal)
        .map_err(|_| out_of_range())
}

fn parse_instant(
    field: &'static str,
    value: &str,
) -> Result<sqlx::types::time::OffsetDateTime, ApiError> {
    let timestamp: jiff::Timestamp = value.parse().or_else(|_| {
        // A bare calendar day means midnight in the university's +05:00 civil
        // calendar (ADR-008 §1), so an audit filter of "today" matches the day
        // the administrator means.
        let date: jiff::civil::Date = value
            .parse()
            .map_err(|_| ApiError::field(field, "expected an RFC 3339 instant or YYYY-MM-DD"))?;
        date.to_zoned(jiff::tz::TimeZone::fixed(jiff::tz::Offset::constant(5)))
            .map(|zoned| zoned.timestamp())
            .map_err(|_| ApiError::field(field, "outside the representable range"))
    })?;
    sqlx::types::time::OffsetDateTime::from_unix_timestamp_nanos(timestamp.as_nanosecond())
        .map_err(|_| ApiError::field(field, "outside the range PostgreSQL can store"))
}

/// `time::OffsetDateTime` as RFC 3339, through `jiff`.
fn format_instant(instant: sqlx::types::time::OffsetDateTime) -> String {
    let nanoseconds = i32::try_from(instant.nanosecond()).unwrap_or(0);
    jiff::Timestamp::new(instant.unix_timestamp(), nanoseconds)
        .map_or_else(|_| instant.unix_timestamp().to_string(), |t| t.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_documented_setting_key_is_validated() {
        // A key the editor offers but `validate_setting` does not know would be
        // refused by its own `PUT`.
        for key in KNOWN_SETTINGS {
            let refused = validate_setting(key, &serde_json::json!(null));
            assert!(
                !matches!(&refused, Err(ApiError::Validation { detail, .. })
                    if detail.contains("unknown setting")),
                "`{key}` is offered but not validated"
            );
        }
    }

    #[test]
    fn settings_are_validated_through_the_domain_types() {
        assert!(validate_setting("k_threshold", &serde_json::json!(5)).is_ok());
        assert!(validate_setting("k_threshold", &serde_json::json!("5")).is_err());
        assert!(validate_setting("k_threshold", &serde_json::json!(0)).is_err());
        assert!(validate_setting("originality_threshold", &serde_json::json!(70)).is_ok());
        assert!(validate_setting("originality_threshold", &serde_json::json!(101)).is_err());
        assert!(validate_setting("exclude_deleted", &serde_json::json!(true)).is_ok());
        assert!(validate_setting("exclude_deleted", &serde_json::json!("yes")).is_err());
        assert!(
            validate_setting(
                "role_mappings",
                &serde_json::json!([{"group": "g", "role": "admin"}])
            )
            .is_ok()
        );
        assert!(
            validate_setting(
                "role_mappings",
                &serde_json::json!([{"group": "g", "role": "dean"}])
            )
            .is_err(),
            "a dean mapping without a faculty must be refused"
        );
        assert!(validate_setting("not_a_setting", &serde_json::json!(1)).is_err());
    }

    #[test]
    fn ethics_counters_must_be_consistent() {
        assert!(validate_counters(10, 4).is_ok());
        assert!(validate_counters(-1, 0).is_err());
        assert!(validate_counters(3, 4).is_err());
    }

    #[test]
    fn pagination_is_bounded() {
        let page = |limit, offset| PageQuery { limit, offset }.bounds();
        assert_eq!(page(None, None), (DEFAULT_PAGE_SIZE, 0));
        assert_eq!(page(Some(10_000), Some(-5)), (MAX_PAGE_SIZE, 0));
        assert_eq!(page(Some(0), Some(20)), (1, 20));
    }

    #[test]
    fn an_audit_filter_date_may_be_a_bare_calendar_day() {
        assert!(parse_instant("from", "2026-03-01").is_ok());
        assert!(parse_instant("from", "2026-03-01T00:00:00Z").is_ok());
        assert!(parse_instant("from", "yesterday").is_err());
    }
}
