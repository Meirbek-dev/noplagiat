/**
* | output |
* | --- |
* | "Add" |
*
* @param {Action_AddInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const action_add: ((inputs?: Action_AddInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Action_AddInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Delete" |
*
* @param {Action_DeleteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const action_delete: ((inputs?: Action_DeleteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Action_DeleteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Save" |
*
* @param {Action_SaveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const action_save: ((inputs?: Action_SaveInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Action_SaveInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Access log" |
*
* @param {Admin_AuditInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_audit: ((inputs?: Admin_AuditInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_AuditInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Every access to the internal contour: who, when, which section, and with which filters." |
*
* @param {Admin_Audit_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_audit_hint: ((inputs?: Admin_Audit_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Audit_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Read: {read} · upserted: {upserted} · rejected: {rejected}" |
*
* @param {Admin_Batch_RowsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_batch_rows: ((inputs: Admin_Batch_RowsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Batch_RowsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No refresh for {hours} h" |
*
* @param {Admin_Batch_StaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_batch_stale: ((inputs: Admin_Batch_StaleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Batch_StaleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Dictionaries and sources" |
*
* @param {Admin_CountsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_counts: ((inputs?: Admin_CountsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_CountsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "What the system currently holds." |
*
* @param {Admin_Counts_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_counts_hint: ((inputs?: Admin_Counts_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Counts_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Dictionaries" |
*
* @param {Admin_DictionariesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_dictionaries: ((inputs?: Admin_DictionariesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_DictionariesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Last import" |
*
* @param {Admin_Last_BatchInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_last_batch: ((inputs?: Admin_Last_BatchInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Last_BatchInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The internal contour refreshes at least once a day." |
*
* @param {Admin_Last_Batch_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_last_batch_hint: ((inputs?: Admin_Last_Batch_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Last_Batch_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Administration areas" |
*
* @param {Admin_Nav_AreasInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_nav_areas: ((inputs?: Admin_Nav_AreasInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Nav_AreasInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Overview" |
*
* @param {Admin_OverviewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_overview: ((inputs?: Admin_OverviewInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_OverviewInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Quick links" |
*
* @param {Admin_Quick_LinksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_quick_links: ((inputs?: Admin_Quick_LinksInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Quick_LinksInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Reports" |
*
* @param {Admin_ReportsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports: ((inputs?: Admin_ReportsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_ReportsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Immutable report snapshots. Publishing puts the file on the public contour." |
*
* @param {Admin_Reports_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports_hint: ((inputs?: Admin_Reports_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Reports_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Unpublished reports" |
*
* @param {Admin_Reports_UnpublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports_unpublished: ((inputs?: Admin_Reports_UnpublishedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Reports_UnpublishedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Roles and access" |
*
* @param {Admin_RolesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_roles: ((inputs?: Admin_RolesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_RolesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Accounts and the roles and scopes granted to them." |
*
* @param {Admin_Roles_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_roles_hint: ((inputs?: Admin_Roles_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Roles_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Settings" |
*
* @param {Admin_SettingsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_settings: ((inputs?: Admin_SettingsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_SettingsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Thresholds, semester boundaries and derivation rules. A change reaches the API immediately." |
*
* @param {Admin_Settings_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_settings_hint: ((inputs?: Admin_Settings_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Settings_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Data sources" |
*
* @param {Admin_SourcesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_sources: ((inputs?: Admin_SourcesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_SourcesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Ingest sources and refresh schedules; manual import runs." |
*
* @param {Admin_Sources_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_sources_hint: ((inputs?: Admin_Sources_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Sources_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Administration" |
*
* @param {Admin_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_title: ((inputs?: Admin_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Dictionary kind" |
*
* @param {Alias_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_kind: ((inputs?: Alias_KindInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Alias_KindInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No aliases defined." |
*
* @param {Alias_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_none: ((inputs?: Alias_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Alias_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Label in the source" |
*
* @param {Alias_Source_LabelInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_source_label: ((inputs?: Alias_Source_LabelInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Alias_Source_LabelInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Dictionary entry" |
*
* @param {Alias_TargetInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_target: ((inputs?: Alias_TargetInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Alias_TargetInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Target code" |
*
* @param {Alias_Target_CodeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_target_code: ((inputs?: Alias_Target_CodeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Alias_Target_CodeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Maps the source system's labels onto the dashboard dictionaries." |
*
* @param {Aliases_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const aliases_hint: ((inputs?: Aliases_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Aliases_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Label aliases" |
*
* @param {Aliases_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const aliases_title: ((inputs?: Aliases_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Aliases_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Try reloading the page. If the error persists, contact the system administrator." |
*
* @param {App_Error_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_body: ((inputs?: App_Error_BodyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<App_Error_BodyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Go to the dashboard" |
*
* @param {App_Error_HomeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_home: ((inputs?: App_Error_HomeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<App_Error_HomeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The page could not be loaded" |
*
* @param {App_Error_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_title: ((inputs?: App_Error_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<App_Error_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Antiplagiarism Dashboard" |
*
* @param {App_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_title: ((inputs?: App_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<App_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Antiplagiarism Dashboard - Toraighyrov University" |
*
* @param {App_Title_FullInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_title_full: ((inputs?: App_Title_FullInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<App_Title_FullInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Action" |
*
* @param {Audit_ActionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action: ((inputs?: Audit_ActionInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_ActionInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Admin change" |
*
* @param {Audit_Action_Admin_ChangeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_admin_change: ((inputs?: Audit_Action_Admin_ChangeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_Action_Admin_ChangeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "PDF export" |
*
* @param {Audit_Action_Export_PdfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_export_pdf: ((inputs?: Audit_Action_Export_PdfInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_Action_Export_PdfInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Excel export" |
*
* @param {Audit_Action_Export_XlsxInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_export_xlsx: ((inputs?: Audit_Action_Export_XlsxInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_Action_Export_XlsxInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "View" |
*
* @param {Audit_Action_ViewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_view: ((inputs?: Audit_Action_ViewInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_Action_ViewInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Any" |
*
* @param {Audit_AnyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_any: ((inputs?: Audit_AnyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_AnyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Filters" |
*
* @param {Audit_FiltersInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_filters: ((inputs?: Audit_FiltersInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_FiltersInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "{total} entries. Retention is at least {days} days; there is no deletion path." |
*
* @param {Audit_FooterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_footer: ((inputs: Audit_FooterInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_FooterInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "IP address" |
*
* @param {Audit_IpInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_ip: ((inputs?: Audit_IpInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_IpInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No entries match these filters." |
*
* @param {Audit_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_none: ((inputs?: Audit_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Role" |
*
* @param {Audit_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_role: ((inputs?: Audit_RoleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_RoleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Section" |
*
* @param {Audit_SectionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_section: ((inputs?: Audit_SectionInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_SectionInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Time" |
*
* @param {Audit_TimeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_time: ((inputs?: Audit_TimeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_TimeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "User" |
*
* @param {Audit_UserInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_user: ((inputs?: Audit_UserInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_UserInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No rejected rows." |
*
* @param {Batch_Errors_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_empty: ((inputs?: Batch_Errors_EmptyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Errors_EmptyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Hide errors" |
*
* @param {Batch_Errors_HideInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_hide: ((inputs?: Batch_Errors_HideInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Errors_HideInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Errors" |
*
* @param {Batch_Errors_ShowInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_show: ((inputs?: Batch_Errors_ShowInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Errors_ShowInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Rejected rows of batch #{id}" |
*
* @param {Batch_Errors_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_title: ((inputs: Batch_Errors_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Errors_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Read" |
*
* @param {Batch_Rows_ReadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_read: ((inputs?: Batch_Rows_ReadInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Rows_ReadInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Rejected" |
*
* @param {Batch_Rows_RejectedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_rejected: ((inputs?: Batch_Rows_RejectedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Rows_RejectedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Skipped" |
*
* @param {Batch_Rows_SkippedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_skipped: ((inputs?: Batch_Rows_SkippedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Rows_SkippedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Upserted" |
*
* @param {Batch_Rows_UpsertedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_upserted: ((inputs?: Batch_Rows_UpsertedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Rows_UpsertedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Source" |
*
* @param {Batch_SourceInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_source: ((inputs?: Batch_SourceInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_SourceInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Started" |
*
* @param {Batch_StartedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_started: ((inputs?: Batch_StartedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_StartedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Status" |
*
* @param {Batch_StatusInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status: ((inputs?: Batch_StatusInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_StatusInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Failed" |
*
* @param {Batch_Status_FailedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_failed: ((inputs?: Batch_Status_FailedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Status_FailedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Running" |
*
* @param {Batch_Status_RunningInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_running: ((inputs?: Batch_Status_RunningInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Status_RunningInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Succeeded" |
*
* @param {Batch_Status_SucceededInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_succeeded: ((inputs?: Batch_Status_SucceededInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Status_SucceededInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No imports yet." |
*
* @param {Batches_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_empty: ((inputs?: Batches_EmptyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batches_EmptyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Every run is journalled: time, source, row counts, validation errors." |
*
* @param {Batches_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_hint: ((inputs?: Batches_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batches_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Import journal" |
*
* @param {Batches_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_title: ((inputs?: Batches_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batches_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Toraighyrov University" |
*
* @param {Brand_LockupInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const brand_lockup: ((inputs?: Brand_LockupInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Brand_LockupInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Chart_Axis_Academic_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_academic_year: ((inputs?: Chart_Axis_Academic_YearInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_Academic_YearInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Active reviewers" |
*
* @param {Chart_Axis_Active_ReviewersInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_active_reviewers: ((inputs?: Chart_Axis_Active_ReviewersInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_Active_ReviewersInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Category" |
*
* @param {Chart_Axis_CategoryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_category: ((inputs?: Chart_Axis_CategoryInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_CategoryInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Number of checks" |
*
* @param {Chart_Axis_CountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_count: ((inputs?: Chart_Axis_CountInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_CountInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Faculty" |
*
* @param {Chart_Axis_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_faculty: ((inputs?: Chart_Axis_FacultyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_FacultyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Month" |
*
* @param {Chart_Axis_MonthInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_month: ((inputs?: Chart_Axis_MonthInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_MonthInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Originality, %" |
*
* @param {Chart_Axis_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_originality: ((inputs?: Chart_Axis_OriginalityInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_OriginalityInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Share of total, %" |
*
* @param {Chart_Axis_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_share: ((inputs?: Chart_Axis_ShareInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_ShareInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Value" |
*
* @param {Chart_Axis_ValueInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_value: ((inputs?: Chart_Axis_ValueInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_ValueInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Chart_Axis_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_work_type: ((inputs?: Chart_Axis_Work_TypeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_Work_TypeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "50–70%" |
*
* @param {Chart_Bucket_50_70Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_50_70: ((inputs?: Chart_Bucket_50_70Inputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Bucket_50_70Inputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "70–85%" |
*
* @param {Chart_Bucket_70_85Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_70_85: ((inputs?: Chart_Bucket_70_85Inputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Bucket_70_85Inputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "85–95%" |
*
* @param {Chart_Bucket_85_95Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_85_95: ((inputs?: Chart_Bucket_85_95Inputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Bucket_85_95Inputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "95% and above" |
*
* @param {Chart_Bucket_Gte_95Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_gte_95: ((inputs?: Chart_Bucket_Gte_95Inputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Bucket_Gte_95Inputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "below 50%" |
*
* @param {Chart_Bucket_Lt_50Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_lt_50: ((inputs?: Chart_Bucket_Lt_50Inputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Bucket_Lt_50Inputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Data table" |
*
* @param {Chart_Data_TableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_data_table: ((inputs?: Chart_Data_TableInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Data_TableInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Escalations and rechecks by month" |
*
* @param {Chart_Dynamics_Flags_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_dynamics_flags_title: ((inputs?: Chart_Dynamics_Flags_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Dynamics_Flags_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Checks and average originality by month" |
*
* @param {Chart_Dynamics_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_dynamics_title: ((inputs?: Chart_Dynamics_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Dynamics_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No data for the selected filters" |
*
* @param {Chart_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_empty: ((inputs?: Chart_EmptyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_EmptyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Figures by faculty" |
*
* @param {Chart_Faculties_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_faculties_title: ((inputs?: Chart_Faculties_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Faculties_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Colour scale: from the lowest to the highest value in the column" |
*
* @param {Chart_Heatmap_ScaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_heatmap_scale: ((inputs?: Chart_Heatmap_ScaleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Heatmap_ScaleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Unit" |
*
* @param {Chart_Heatmap_UnitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_heatmap_unit: ((inputs?: Chart_Heatmap_UnitInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Heatmap_UnitInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Originality range" |
*
* @param {Chart_Histogram_BucketInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_histogram_bucket: ((inputs?: Chart_Histogram_BucketInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Histogram_BucketInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Checks by originality band" |
*
* @param {Chart_Histogram_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_histogram_title: ((inputs?: Chart_Histogram_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Histogram_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "down by {delta}" |
*
* @param {Chart_Kpi_Delta_DownInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_down: ((inputs: Chart_Kpi_Delta_DownInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Kpi_Delta_DownInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "no change" |
*
* @param {Chart_Kpi_Delta_FlatInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_flat: ((inputs?: Chart_Kpi_Delta_FlatInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Kpi_Delta_FlatInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "up by {delta}" |
*
* @param {Chart_Kpi_Delta_UpInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_up: ((inputs: Chart_Kpi_Delta_UpInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Kpi_Delta_UpInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "vs previous period" |
*
* @param {Chart_Kpi_PreviousInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_previous: ((inputs?: Chart_Kpi_PreviousInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Kpi_PreviousInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Trend over the period" |
*
* @param {Chart_Kpi_SparklineInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_sparkline: ((inputs?: Chart_Kpi_SparklineInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Kpi_SparklineInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Legend" |
*
* @param {Chart_LegendInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_legend: ((inputs?: Chart_LegendInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_LegendInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Autumn semester {year}" |
*
* @param {Chart_Semester_AutumnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_autumn: ((inputs: Chart_Semester_AutumnInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Semester_AutumnInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Semester boundaries" |
*
* @param {Chart_Semester_BandsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_bands: ((inputs?: Chart_Semester_BandsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Semester_BandsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Shading marks the autumn semester" |
*
* @param {Chart_Semester_ShadingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_shading: ((inputs?: Chart_Semester_ShadingInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Semester_ShadingInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Spring semester {year}" |
*
* @param {Chart_Semester_SpringInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_spring: ((inputs: Chart_Semester_SpringInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Semester_SpringInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Active reviewers" |
*
* @param {Chart_Series_Active_ReviewersInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_active_reviewers: ((inputs?: Chart_Series_Active_ReviewersInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Series_Active_ReviewersInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Checks" |
*
* @param {Chart_Series_ChecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_checks: ((inputs?: Chart_Series_ChecksInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Series_ChecksInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Chart_Series_EscalatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_escalated: ((inputs?: Chart_Series_EscalatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Series_EscalatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Average originality" |
*
* @param {Chart_Series_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_originality: ((inputs?: Chart_Series_OriginalityInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Series_OriginalityInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Rechecks" |
*
* @param {Chart_Series_RechecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_rechecks: ((inputs?: Chart_Series_RechecksInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Series_RechecksInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "{count} of {total} values are hidden: insufficient data" |
*
* @param {Chart_Suppressed_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_suppressed_note: ((inputs: Chart_Suppressed_NoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Suppressed_NoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Metrics by faculty and department" |
*
* @param {Chart_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_units_title: ((inputs?: Chart_Units_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Units_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Active reviewers by month" |
*
* @param {Chart_Usage_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_usage_title: ((inputs?: Chart_Usage_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Usage_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Checks by work type" |
*
* @param {Chart_Work_Types_CountsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_work_types_counts: ((inputs?: Chart_Work_Types_CountsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Work_Types_CountsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Originality by work type" |
*
* @param {Chart_Work_Types_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_work_types_originality: ((inputs?: Chart_Work_Types_OriginalityInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Work_Types_OriginalityInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Delete this entry? This cannot be undone." |
*
* @param {Confirm_DeleteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_delete: ((inputs?: Confirm_DeleteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Confirm_DeleteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Revoke this role from the account?" |
*
* @param {Confirm_Revoke_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_revoke_role: ((inputs?: Confirm_Revoke_RoleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Confirm_Revoke_RoleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Unpublish this report? It will no longer be available on the public dashboard." |
*
* @param {Confirm_Unpublish_ReportInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_unpublish_report: ((inputs?: Confirm_Unpublish_ReportInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Confirm_Unpublish_ReportInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Active" |
*
* @param {Dict_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active: ((inputs?: Dict_ActiveInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_ActiveInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No" |
*
* @param {Dict_Active_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active_no: ((inputs?: Dict_Active_NoInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Active_NoInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Yes" |
*
* @param {Dict_Active_YesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active_yes: ((inputs?: Dict_Active_YesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Active_YesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Code" |
*
* @param {Dict_CodeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_code: ((inputs?: Dict_CodeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_CodeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Unique code of the dictionary entry." |
*
* @param {Dict_Code_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_code_hint: ((inputs?: Dict_Code_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Code_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Dictionary entries" |
*
* @param {Dict_EntriesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_entries: ((inputs?: Dict_EntriesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_EntriesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Adding an existing code replaces the entry." |
*
* @param {Dict_Entries_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_entries_hint: ((inputs?: Dict_Entries_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Entries_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Name (EN)" |
*
* @param {Dict_Name_EnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_en: ((inputs?: Dict_Name_EnInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Name_EnInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Name (KK)" |
*
* @param {Dict_Name_KkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_kk: ((inputs?: Dict_Name_KkInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Name_KkInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Name (RU)" |
*
* @param {Dict_Name_RuInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_ru: ((inputs?: Dict_Name_RuInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Name_RuInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The dictionary is empty." |
*
* @param {Dict_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_none: ((inputs?: Dict_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Parent unit" |
*
* @param {Dict_ParentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_parent: ((inputs?: Dict_ParentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_ParentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Not selected" |
*
* @param {Dict_Parent_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_parent_none: ((inputs?: Dict_Parent_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Parent_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Sort order" |
*
* @param {Dict_Sort_OrderInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_sort_order: ((inputs?: Dict_Sort_OrderInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Sort_OrderInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Departments" |
*
* @param {Dict_Tab_DepartmentsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_departments: ((inputs?: Dict_Tab_DepartmentsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Tab_DepartmentsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Faculties" |
*
* @param {Dict_Tab_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_faculties: ((inputs?: Dict_Tab_FacultiesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Tab_FacultiesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Programmes" |
*
* @param {Dict_Tab_ProgramsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_programs: ((inputs?: Dict_Tab_ProgramsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Tab_ProgramsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Work types" |
*
* @param {Dict_Tab_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_work_types: ((inputs?: Dict_Tab_Work_TypesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Tab_Work_TypesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Academic integrity - widget" |
*
* @param {Embed_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const embed_title: ((inputs?: Embed_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Embed_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The selected unit is outside your area of visibility. Change the filter or contact an administrator." |
*
* @param {Error_Out_Of_ScopeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_out_of_scope: ((inputs?: Error_Out_Of_ScopeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Error_Out_Of_ScopeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Your role does not grant access to this section. Contact the system administrator." |
*
* @param {Error_Role_DeniedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_role_denied: ((inputs?: Error_Role_DeniedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Error_Role_DeniedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The session has ended. Sign in again." |
*
* @param {Error_Session_ExpiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_session_expired: ((inputs?: Error_Session_ExpiredInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Error_Session_ExpiredInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The per-unit breakdown is always k-screened, whatever the role." |
*
* @param {Escalations_Units_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const escalations_units_note: ((inputs?: Escalations_Units_NoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Escalations_Units_NoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Escalations by unit" |
*
* @param {Escalations_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const escalations_units_title: ((inputs?: Escalations_Units_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Escalations_Units_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The Ethics Council register is empty for this period." |
*
* @param {Ethics_Cases_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_cases_empty: ((inputs?: Ethics_Cases_EmptyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_Cases_EmptyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Ethics Council register" |
*
* @param {Ethics_Cases_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_cases_title: ((inputs?: Ethics_Cases_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_Cases_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Violation category" |
*
* @param {Ethics_CategoryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_category: ((inputs?: Ethics_CategoryInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_CategoryInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Closed" |
*
* @param {Ethics_ClosedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_closed: ((inputs?: Ethics_ClosedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_ClosedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Referred" |
*
* @param {Ethics_ReferredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_referred: ((inputs?: Ethics_ReferredInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_ReferredInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Ethics_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_year: ((inputs?: Ethics_YearInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_YearInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Preparing…" |
*
* @param {Export_BusyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_busy: ((inputs?: Export_BusyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_BusyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The file could not be generated." |
*
* @param {Export_ErrorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_error: ((inputs?: Export_ErrorInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_ErrorInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "For official use only. The export is journalled." |
*
* @param {Export_Official_UseInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_official_use: ((inputs?: Export_Official_UseInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_Official_UseInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Export PDF" |
*
* @param {Export_PdfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_pdf: ((inputs?: Export_PdfInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_PdfInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The file contains the figures for the selected period with the current filters applied." |
*
* @param {Export_Public_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_public_hint: ((inputs?: Export_Public_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_Public_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Data export" |
*
* @param {Export_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_title: ((inputs?: Export_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Export Excel" |
*
* @param {Export_XlsxInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_xlsx: ((inputs?: Export_XlsxInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_XlsxInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "All departments" |
*
* @param {Filter_All_DepartmentsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_departments: ((inputs?: Filter_All_DepartmentsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_All_DepartmentsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "All faculties" |
*
* @param {Filter_All_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_faculties: ((inputs?: Filter_All_FacultiesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_All_FacultiesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "All statuses" |
*
* @param {Filter_All_StatusesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_statuses: ((inputs?: Filter_All_StatusesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_All_StatusesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "All work types" |
*
* @param {Filter_All_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_work_types: ((inputs?: Filter_All_Work_TypesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_All_Work_TypesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Filters" |
*
* @param {Filter_Bar_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_bar_title: ((inputs?: Filter_Bar_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Bar_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Department" |
*
* @param {Filter_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_department: ((inputs?: Filter_DepartmentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_DepartmentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Faculty" |
*
* @param {Filter_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_faculty: ((inputs?: Filter_FacultyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_FacultyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Start date" |
*
* @param {Filter_FromInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_from: ((inputs?: Filter_FromInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_FromInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Period" |
*
* @param {Filter_PeriodInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period: ((inputs?: Filter_PeriodInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_PeriodInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "3 years" |
*
* @param {Filter_Period_3yInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_3y: ((inputs?: Filter_Period_3yInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Period_3yInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "5 years" |
*
* @param {Filter_Period_5yInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_5y: ((inputs?: Filter_Period_5yInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Period_5yInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Custom" |
*
* @param {Filter_Period_CustomInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_custom: ((inputs?: Filter_Period_CustomInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Period_CustomInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Month" |
*
* @param {Filter_Period_MonthInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_month: ((inputs?: Filter_Period_MonthInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Period_MonthInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Semester" |
*
* @param {Filter_Period_SemesterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_semester: ((inputs?: Filter_Period_SemesterInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Period_SemesterInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Showing {from} - {to}" |
*
* @param {Filter_Period_ShownInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_shown: ((inputs: Filter_Period_ShownInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Period_ShownInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Filter_Period_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_year: ((inputs?: Filter_Period_YearInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Period_YearInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Study program" |
*
* @param {Filter_ProgramInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program: ((inputs?: Filter_ProgramInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_ProgramInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Enter the study-programme code - picking from a list is not available yet." |
*
* @param {Filter_Program_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program_hint: ((inputs?: Filter_Program_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Program_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "PROG01" |
*
* @param {Filter_Program_PlaceholderInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program_placeholder: ((inputs?: Filter_Program_PlaceholderInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Program_PlaceholderInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Reset filters" |
*
* @param {Filter_ResetInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_reset: ((inputs?: Filter_ResetInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_ResetInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Check status" |
*
* @param {Filter_StatusInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_status: ((inputs?: Filter_StatusInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_StatusInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "End date" |
*
* @param {Filter_ToInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_to: ((inputs?: Filter_ToInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_ToInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Filter_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_work_type: ((inputs?: Filter_Work_TypeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Work_TypeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "This dashboard publishes anonymized statistics on originality checks of written work at Toraighyrov University. Figures are aggregated - by university, facul..." |
*
* @param {Footer_About_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_about_body: ((inputs?: Footer_About_BodyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Footer_About_BodyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "About this dashboard" |
*
* @param {Footer_About_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_about_title: ((inputs?: Footer_About_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Footer_About_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Sections" |
*
* @param {Footer_Sections_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_sections_title: ((inputs?: Footer_Sections_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Footer_Sections_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Staff sign-in" |
*
* @param {Footer_Staff_LinkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_staff_link: ((inputs?: Footer_Staff_LinkInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Footer_Staff_LinkInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The data is refreshed at least once a day." |
*
* @param {Footer_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_updated: ((inputs?: Footer_UpdatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Footer_UpdatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Could not save" |
*
* @param {Form_ErrorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_error: ((inputs?: Form_ErrorInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_ErrorInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Enter a valid e-mail address" |
*
* @param {Form_Invalid_EmailInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_email: ((inputs?: Form_Invalid_EmailInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_Invalid_EmailInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Malformed JSON, or the structure does not match" |
*
* @param {Form_Invalid_JsonInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_json: ((inputs?: Form_Invalid_JsonInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_Invalid_JsonInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Enter a non-negative whole number" |
*
* @param {Form_Invalid_NumberInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_number: ((inputs?: Form_Invalid_NumberInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_Invalid_NumberInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Required" |
*
* @param {Form_RequiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_required: ((inputs?: Form_RequiredInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_RequiredInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Saved" |
*
* @param {Form_SavedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_saved: ((inputs?: Form_SavedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_SavedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Saving…" |
*
* @param {Form_SavingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_saving: ((inputs?: Form_SavingInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_SavingInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Interface language" |
*
* @param {Header_Locale_LabelInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const header_locale_label: ((inputs?: Header_Locale_LabelInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Header_Locale_LabelInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Skip to content" |
*
* @param {Header_Skip_LinkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const header_skip_link: ((inputs?: Header_Skip_LinkInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Header_Skip_LinkInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Other" |
*
* @param {Initiator_OtherInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_other: ((inputs?: Initiator_OtherInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_OtherInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Registrar's office" |
*
* @param {Initiator_RegistrarInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_registrar: ((inputs?: Initiator_RegistrarInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_RegistrarInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Derive the initiator role from the reviewer's address." |
*
* @param {Initiator_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_rules_hint: ((inputs?: Initiator_Rules_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_Rules_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Initiator rules" |
*
* @param {Initiator_Rules_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_rules_title: ((inputs?: Initiator_Rules_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_Rules_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Teaching staff (self-check)" |
*
* @param {Initiator_Staff_SelfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_staff_self: ((inputs?: Initiator_Staff_SelfInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_Staff_SelfInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Student" |
*
* @param {Initiator_StudentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_student: ((inputs?: Initiator_StudentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_StudentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "insufficient data" |
*
* @param {Insufficient_DataInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const insufficient_data: ((inputs?: Insufficient_DataInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Insufficient_DataInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Internal Antiplagiarism Analytics" |
*
* @param {Internal_Contour_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_contour_title: ((inputs?: Internal_Contour_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Contour_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Other" |
*
* @param {Internal_Nav_OtherInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_other: ((inputs?: Internal_Nav_OtherInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Nav_OtherInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Public contour" |
*
* @param {Internal_Nav_PublicInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_public: ((inputs?: Internal_Nav_PublicInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Nav_PublicInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Sections" |
*
* @param {Internal_Nav_SectionsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_sections: ((inputs?: Internal_Nav_SectionsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Nav_SectionsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Show or hide the menu" |
*
* @param {Internal_Nav_ToggleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_toggle: ((inputs?: Internal_Nav_ToggleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Nav_ToggleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Metrics within your area of visibility." |
*
* @param {Internal_Overview_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_overview_hint: ((inputs?: Internal_Overview_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Overview_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Groups smaller than {k} checks are not published - the value is replaced by «insufficient data»." |
*
* @param {K_Threshold_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const k_threshold_note: ((inputs: K_Threshold_NoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<K_Threshold_NoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Average originality" |
*
* @param {Kpi_Avg_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_avg_originality: ((inputs?: Kpi_Avg_OriginalityInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Avg_OriginalityInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Mean across every check in the period" |
*
* @param {Kpi_Avg_Originality_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_avg_originality_hint: ((inputs?: Kpi_Avg_Originality_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Avg_Originality_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Share below the threshold" |
*
* @param {Kpi_Below_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_below_threshold: ((inputs?: Kpi_Below_ThresholdInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Below_ThresholdInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Checks below the threshold: {count}" |
*
* @param {Kpi_Below_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_below_threshold_hint: ((inputs: Kpi_Below_Threshold_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Below_Threshold_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Check coverage" |
*
* @param {Kpi_CoverageInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_coverage: ((inputs?: Kpi_CoverageInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_CoverageInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Share of submitted works that were checked" |
*
* @param {Kpi_Coverage_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_coverage_hint: ((inputs?: Kpi_Coverage_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Coverage_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Kpi_EscalatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated: ((inputs?: Kpi_EscalatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_EscalatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Suspicious works whose flag has not been cleared" |
*
* @param {Kpi_Escalated_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_hint: ((inputs?: Kpi_Escalated_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Escalated_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Escalation share" |
*
* @param {Kpi_Escalated_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_share: ((inputs?: Kpi_Escalated_ShareInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Escalated_ShareInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Of the period's checks" |
*
* @param {Kpi_Escalated_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_share_hint: ((inputs?: Kpi_Escalated_Share_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Escalated_Share_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Improved" |
*
* @param {Kpi_ImprovedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved: ((inputs?: Kpi_ImprovedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_ImprovedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Improved share" |
*
* @param {Kpi_Improved_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved_share: ((inputs?: Kpi_Improved_ShareInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Improved_ShareInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Works improved: {count}" |
*
* @param {Kpi_Improved_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved_share_hint: ((inputs: Kpi_Improved_Share_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Improved_Share_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Recheck share" |
*
* @param {Kpi_Recheck_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_recheck_share: ((inputs?: Kpi_Recheck_ShareInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Recheck_ShareInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Of all works" |
*
* @param {Kpi_Recheck_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_recheck_share_hint: ((inputs?: Kpi_Recheck_Share_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Recheck_Share_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Total checks" |
*
* @param {Kpi_Total_ChecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_total_checks: ((inputs?: Kpi_Total_ChecksInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Total_ChecksInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "For the selected period" |
*
* @param {Kpi_Total_Checks_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_total_checks_hint: ((inputs?: Kpi_Total_Checks_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Total_Checks_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Rechecked" |
*
* @param {Kpi_Works_RecheckedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_rechecked: ((inputs?: Kpi_Works_RecheckedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Works_RecheckedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Works with more than one attempt" |
*
* @param {Kpi_Works_Rechecked_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_rechecked_hint: ((inputs?: Kpi_Works_Rechecked_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Works_Rechecked_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Works in total" |
*
* @param {Kpi_Works_TotalInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_total: ((inputs?: Kpi_Works_TotalInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Works_TotalInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Distinct works in the period" |
*
* @param {Kpi_Works_Total_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_total_hint: ((inputs?: Kpi_Works_Total_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Works_Total_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "English" |
*
* @param {Locale_Name_EnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_en: ((inputs?: Locale_Name_EnInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Locale_Name_EnInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Қазақша" |
*
* @param {Locale_Name_KkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_kk: ((inputs?: Locale_Name_KkInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Locale_Name_KkInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Русский" |
*
* @param {Locale_Name_RuInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_ru: ((inputs?: Locale_Name_RuInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Locale_Name_RuInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The login name or password is not correct." |
*
* @param {Login_FailedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_failed: ((inputs?: Login_FailedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_FailedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Sign in with the account your system administrator created." |
*
* @param {Login_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_hint: ((inputs?: Login_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Accounts are created by the system administrator. Ask them if you have no sign-in or have forgotten your password." |
*
* @param {Login_No_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_no_account: ((inputs?: Login_No_AccountInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_No_AccountInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Password" |
*
* @param {Login_PasswordInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_password: ((inputs?: Login_PasswordInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_PasswordInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Login_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_submit: ((inputs?: Login_SubmitInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_SubmitInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Too many sign-in attempts. Wait a moment and try again." |
*
* @param {Login_ThrottledInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_throttled: ((inputs?: Login_ThrottledInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_ThrottledInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Sign in to the internal contour" |
*
* @param {Login_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_title: ((inputs?: Login_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Login name" |
*
* @param {Login_UsernameInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_username: ((inputs?: Login_UsernameInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_UsernameInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Sign out" |
*
* @param {Logout_ButtonInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const logout_button: ((inputs?: Logout_ButtonInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Logout_ButtonInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Page not found" |
*
* @param {Not_Found_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const not_found_title: ((inputs?: Not_Found_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Not_Found_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Academic Integrity - Open Statistics" |
*
* @param {Public_Contour_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const public_contour_title: ((inputs?: Public_Contour_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Public_Contour_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Rechecks by unit" |
*
* @param {Rechecks_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rechecks_units_title: ((inputs?: Rechecks_Units_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rechecks_Units_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Files" |
*
* @param {Report_FilesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_files: ((inputs?: Report_FilesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_FilesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Available once published" |
*
* @param {Report_Files_After_PublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_files_after_publish: ((inputs?: Report_Files_After_PublishInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_Files_After_PublishInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Generate report" |
*
* @param {Report_GenerateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generate: ((inputs?: Report_GenerateInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_GenerateInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The annual report runs 1 September – 31 August; a manual report takes any date range." |
*
* @param {Report_Generate_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generate_hint: ((inputs?: Report_Generate_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_Generate_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Generated" |
*
* @param {Report_Generated_AtInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generated_at: ((inputs?: Report_Generated_AtInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_Generated_AtInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The report has been generated" |
*
* @param {Report_Generated_OkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generated_ok: ((inputs?: Report_Generated_OkInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_Generated_OkInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Report kind" |
*
* @param {Report_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_kind: ((inputs?: Report_KindInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_KindInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Report language" |
*
* @param {Report_LocaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_locale: ((inputs?: Report_LocaleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_LocaleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No reports have been generated yet." |
*
* @param {Report_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_none: ((inputs?: Report_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Period" |
*
* @param {Report_PeriodInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_period: ((inputs?: Report_PeriodInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_PeriodInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Publish" |
*
* @param {Report_PublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_publish: ((inputs?: Report_PublishInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_PublishInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Published" |
*
* @param {Report_PublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_published: ((inputs?: Report_PublishedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_PublishedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Publication" |
*
* @param {Report_Published_StateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_published_state: ((inputs?: Report_Published_StateInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_Published_StateInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Unpublish" |
*
* @param {Report_UnpublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_unpublish: ((inputs?: Report_UnpublishInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_UnpublishInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Not published" |
*
* @param {Report_UnpublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_unpublished: ((inputs?: Report_UnpublishedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_UnpublishedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Download {format}" |
*
* @param {Reports_DownloadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_download: ((inputs: Reports_DownloadInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Reports_DownloadInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No reports have been published yet." |
*
* @param {Reports_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_empty: ((inputs?: Reports_EmptyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Reports_EmptyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Generated {date}" |
*
* @param {Reports_GeneratedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_generated: ((inputs: Reports_GeneratedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Reports_GeneratedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Annual report" |
*
* @param {Reports_Kind_AnnualInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_kind_annual: ((inputs?: Reports_Kind_AnnualInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Reports_Kind_AnnualInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Period report" |
*
* @param {Reports_Kind_ManualInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_kind_manual: ((inputs?: Reports_Kind_ManualInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Reports_Kind_ManualInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Your account" |
*
* @param {Request_Access_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_account: ((inputs?: Request_Access_AccountInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_AccountInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Back to the public statistics" |
*
* @param {Request_Access_BackInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_back: ((inputs?: Request_Access_BackInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_BackInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "You are signed in, but your account has no rights to the internal contour. Access is granted on a request from the head of your unit, agreed with the system ..." |
*
* @param {Request_Access_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_body: ((inputs?: Request_Access_BodyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_BodyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The teaching-staff role covers the public contour. Unit-level detail needs a separate role." |
*
* @param {Request_Access_Staff_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_staff_note: ((inputs?: Request_Access_Staff_NoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_Staff_NoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The system administrator grants the role and its scope - a faculty or a department." |
*
* @param {Request_Access_Step_AdminInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_admin: ((inputs?: Request_Access_Step_AdminInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_Step_AdminInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The head of your unit submits an access request." |
*
* @param {Request_Access_Step_HeadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_head: ((inputs?: Request_Access_Step_HeadInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_Step_HeadInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Sign in again once the role is granted, and the section opens." |
*
* @param {Request_Access_Step_SigninInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_signin: ((inputs?: Request_Access_Step_SigninInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_Step_SigninInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No access to the internal contour" |
*
* @param {Request_Access_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_title: ((inputs?: Request_Access_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Administrator" |
*
* @param {Role_AdminInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_admin: ((inputs?: Role_AdminInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Role_AdminInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Compliance office" |
*
* @param {Role_ComplianceInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_compliance: ((inputs?: Role_ComplianceInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Role_ComplianceInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Dean" |
*
* @param {Role_DeanInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_dean: ((inputs?: Role_DeanInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Role_DeanInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Head of department" |
*
* @param {Role_Dept_HeadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_dept_head: ((inputs?: Role_Dept_HeadInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Role_Dept_HeadInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Ethics officer" |
*
* @param {Role_EthicsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_ethics: ((inputs?: Role_EthicsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Role_EthicsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No role" |
*
* @param {Role_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_none: ((inputs?: Role_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Role_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Teaching staff" |
*
* @param {Role_StaffInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_staff: ((inputs?: Role_StaffInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Role_StaffInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Account" |
*
* @param {Roles_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_account: ((inputs?: Roles_AccountInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_AccountInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "State" |
*
* @param {Roles_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_active: ((inputs?: Roles_ActiveInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_ActiveInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Disabled" |
*
* @param {Roles_Active_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_active_no: ((inputs?: Roles_Active_NoInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Active_NoInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Active" |
*
* @param {Roles_Active_YesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_active_yes: ((inputs?: Roles_Active_YesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Active_YesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Grant a role" |
*
* @param {Roles_GrantInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant: ((inputs?: Roles_GrantInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_GrantInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "A dean needs a faculty code, a head of department a department code." |
*
* @param {Roles_Grant_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant_hint: ((inputs?: Roles_Grant_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Grant_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Grant" |
*
* @param {Roles_Grant_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant_submit: ((inputs?: Roles_Grant_SubmitInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Grant_SubmitInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Grants" |
*
* @param {Roles_GrantsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grants: ((inputs?: Roles_GrantsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_GrantsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No accounts." |
*
* @param {Roles_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_none: ((inputs?: Roles_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Revoke the role" |
*
* @param {Roles_RevokeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_revoke: ((inputs?: Roles_RevokeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_RevokeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Role" |
*
* @param {Roles_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_role: ((inputs?: Roles_RoleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_RoleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Scope: department" |
*
* @param {Roles_Scope_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_department: ((inputs?: Roles_Scope_DepartmentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Scope_DepartmentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Required for a head of department" |
*
* @param {Roles_Scope_Department_RequiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_department_required: ((inputs?: Roles_Scope_Department_RequiredInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Scope_Department_RequiredInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Scope: faculty" |
*
* @param {Roles_Scope_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_faculty: ((inputs?: Roles_Scope_FacultyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Scope_FacultyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Required for a dean" |
*
* @param {Roles_Scope_Faculty_RequiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_faculty_required: ((inputs?: Roles_Scope_Faculty_RequiredInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Scope_Faculty_RequiredInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Unrestricted" |
*
* @param {Roles_Scope_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_none: ((inputs?: Roles_Scope_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Scope_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "SSO subject" |
*
* @param {Roles_SubjectInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_subject: ((inputs?: Roles_SubjectInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_SubjectInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Enable" |
*
* @param {Rule_ActivateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_activate: ((inputs?: Rule_ActivateInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_ActivateInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Active" |
*
* @param {Rule_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_active: ((inputs?: Rule_ActiveInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_ActiveInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Disable" |
*
* @param {Rule_DeactivateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_deactivate: ((inputs?: Rule_DeactivateInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_DeactivateInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Initiator" |
*
* @param {Rule_InitiatorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_initiator: ((inputs?: Rule_InitiatorInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_InitiatorInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No rules defined." |
*
* @param {Rule_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_none: ((inputs?: Rule_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Pattern" |
*
* @param {Rule_PatternInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_pattern: ((inputs?: Rule_PatternInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_PatternInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Substring matched against the normalized work title." |
*
* @param {Rule_Pattern_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_pattern_hint: ((inputs?: Rule_Pattern_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_Pattern_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Priority" |
*
* @param {Rule_PriorityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_priority: ((inputs?: Rule_PriorityInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_PriorityInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The lowest value wins." |
*
* @param {Rule_Priority_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_priority_hint: ((inputs?: Rule_Priority_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_Priority_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Regular expression over the normalized reviewer address." |
*
* @param {Rule_Regex_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_regex_hint: ((inputs?: Rule_Regex_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_Regex_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Rule_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_work_type: ((inputs?: Rule_Work_TypeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_Work_TypeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The whole university" |
*
* @param {Scope_AllInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_all: ((inputs?: Scope_AllInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Scope_AllInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Within the department" |
*
* @param {Scope_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_department: ((inputs?: Scope_DepartmentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Scope_DepartmentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Within the faculty" |
*
* @param {Scope_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_faculty: ((inputs?: Scope_FacultyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Scope_FacultyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No scope" |
*
* @param {Scope_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_none: ((inputs?: Scope_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Scope_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Trends over time" |
*
* @param {Section_DynamicsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_dynamics: ((inputs?: Section_DynamicsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_DynamicsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Number of checks and average originality by month." |
*
* @param {Section_Dynamics_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_dynamics_hint: ((inputs?: Section_Dynamics_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Dynamics_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "This section could not be loaded" |
*
* @param {Section_Error_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_error_title: ((inputs?: Section_Error_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Error_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The service is temporarily unavailable." |
*
* @param {Section_Error_UnavailableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_error_unavailable: ((inputs?: Section_Error_UnavailableInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Error_UnavailableInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Section_EscalationsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_escalations: ((inputs?: Section_EscalationsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_EscalationsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Aggregated counters of cases referred to the Ethics Council, with no personal data." |
*
* @param {Section_Escalations_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_escalations_hint: ((inputs?: Section_Escalations_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Escalations_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "By faculty" |
*
* @param {Section_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_faculties: ((inputs?: Section_FacultiesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_FacultiesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Aggregated figures per faculty and institute." |
*
* @param {Section_Faculties_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_faculties_hint: ((inputs?: Section_Faculties_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Faculties_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Originality distribution" |
*
* @param {Section_HistogramInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_histogram: ((inputs?: Section_HistogramInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_HistogramInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "How checks are distributed across the originality bands." |
*
* @param {Section_Histogram_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_histogram_hint: ((inputs?: Section_Histogram_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Histogram_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "{section} - in development" |
*
* @param {Section_In_DevelopmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_in_development: ((inputs: Section_In_DevelopmentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_In_DevelopmentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Loading data" |
*
* @param {Section_LoadingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_loading: ((inputs?: Section_LoadingInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_LoadingInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Overview" |
*
* @param {Section_OverviewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_overview: ((inputs?: Section_OverviewInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_OverviewInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Headline figures for the selected period and the change against the same period a year earlier." |
*
* @param {Section_Overview_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_overview_hint: ((inputs?: Section_Overview_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Overview_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Rechecks" |
*
* @param {Section_RechecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_rechecks: ((inputs?: Section_RechecksInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_RechecksInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The share of works rechecked after revision, and how many of them improved." |
*
* @param {Section_Rechecks_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_rechecks_hint: ((inputs?: Section_Rechecks_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Rechecks_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Published reports" |
*
* @param {Section_ReportsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_reports: ((inputs?: Section_ReportsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_ReportsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Annual and ad-hoc anonymized reports." |
*
* @param {Section_Reports_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_reports_hint: ((inputs?: Section_Reports_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Reports_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Retry" |
*
* @param {Section_RetryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_retry: ((inputs?: Section_RetryInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_RetryInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "This section is available to the ethics council and the compliance service. If you need it for your work, contact the system administrator." |
*
* @param {Section_Role_RestrictedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_role_restricted: ((inputs?: Section_Role_RestrictedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Role_RestrictedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "By faculty and department" |
*
* @param {Section_UnitsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_units: ((inputs?: Section_UnitsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_UnitsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Faculty metrics, expandable to departments." |
*
* @param {Section_Units_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_units_hint: ((inputs?: Section_Units_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Units_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "System usage" |
*
* @param {Section_UsageInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_usage: ((inputs?: Section_UsageInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_UsageInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Active reviewers per month and the average check duration." |
*
* @param {Section_Usage_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_usage_hint: ((inputs?: Section_Usage_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Usage_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "By work type" |
*
* @param {Section_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_work_types: ((inputs?: Section_Work_TypesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Work_TypesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Checks and average originality broken down by type of written work." |
*
* @param {Section_Work_Types_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_work_types_hint: ((inputs?: Section_Work_Types_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Work_Types_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Year over year" |
*
* @param {Section_YoyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_yoy: ((inputs?: Section_YoyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_YoyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The figures compared by academic year (1 September - 31 August)." |
*
* @param {Section_Yoy_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_yoy_hint: ((inputs?: Section_Yoy_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Yoy_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Autumn semester start" |
*
* @param {Setting_Autumn_StartInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_autumn_start: ((inputs?: Setting_Autumn_StartInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Autumn_StartInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Exclude deleted documents" |
*
* @param {Setting_Exclude_DeletedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_exclude_deleted: ((inputs?: Setting_Exclude_DeletedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Exclude_DeletedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Rows marked deleted stay out of the aggregates." |
*
* @param {Setting_Exclude_Deleted_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_exclude_deleted_hint: ((inputs?: Setting_Exclude_Deleted_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Exclude_Deleted_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Originality band edges" |
*
* @param {Setting_Histogram_BucketsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets: ((inputs?: Setting_Histogram_BucketsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Histogram_BucketsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Percentages, comma separated and ascending, e.g. 50, 70, 85, 95." |
*
* @param {Setting_Histogram_Buckets_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets_hint: ((inputs?: Setting_Histogram_Buckets_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Histogram_Buckets_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Edges must ascend and stay between 0 and 100" |
*
* @param {Setting_Histogram_Buckets_InvalidInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets_invalid: ((inputs?: Setting_Histogram_Buckets_InvalidInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Histogram_Buckets_InvalidInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "k-anonymity threshold" |
*
* @param {Setting_K_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_k_threshold: ((inputs?: Setting_K_ThresholdInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_K_ThresholdInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Groups smaller than k are not published. The recommended value is 5." |
*
* @param {Setting_K_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_k_threshold_hint: ((inputs?: Setting_K_Threshold_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_K_Threshold_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Originality threshold, %" |
*
* @param {Setting_Originality_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_originality_threshold: ((inputs?: Setting_Originality_ThresholdInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Originality_ThresholdInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Works below the threshold count as needing attention. The default is 70." |
*
* @param {Setting_Originality_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_originality_threshold_hint: ((inputs?: Setting_Originality_Threshold_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Originality_Threshold_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Format MM-DD." |
*
* @param {Setting_Semester_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_semester_hint: ((inputs?: Setting_Semester_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Semester_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Public snapshot quarter" |
*
* @param {Setting_Snapshot_QuarterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_snapshot_quarter: ((inputs?: Setting_Snapshot_QuarterInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Snapshot_QuarterInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "«auto» - together with the internal refresh." |
*
* @param {Setting_Snapshot_Quarter_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_snapshot_quarter_hint: ((inputs?: Setting_Snapshot_Quarter_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Snapshot_Quarter_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Spring semester start" |
*
* @param {Setting_Spring_StartInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_spring_start: ((inputs?: Setting_Spring_StartInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Spring_StartInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Status derivation rules" |
*
* @param {Setting_Status_RulesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_status_rules: ((inputs?: Setting_Status_RulesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Status_RulesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "JSON: default, escalate_when and a list of status/when rules." |
*
* @param {Setting_Status_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_status_rules_hint: ((inputs?: Setting_Status_Rules_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Status_Rules_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Save settings" |
*
* @param {Settings_SaveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_save: ((inputs?: Settings_SaveInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Settings_SaveInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The API response cache was cleared - the change is visible immediately." |
*
* @param {Settings_Saved_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_saved_hint: ((inputs?: Settings_Saved_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Settings_Saved_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Nothing changed" |
*
* @param {Settings_UnchangedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_unchanged: ((inputs?: Settings_UnchangedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Settings_UnchangedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Last changed {date} by {who}" |
*
* @param {Settings_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_updated: ((inputs: Settings_UpdatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Settings_UpdatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "the system" |
*
* @param {Settings_Updated_By_SystemInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_updated_by_system: ((inputs?: Settings_Updated_By_SystemInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Settings_Updated_By_SystemInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Source address" |
*
* @param {Source_Base_UrlInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_base_url: ((inputs?: Source_Base_UrlInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Base_UrlInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Base URL for an API source, watched directory for a CSV one." |
*
* @param {Source_Base_Url_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_base_url_hint: ((inputs?: Source_Base_Url_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Base_Url_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Cursor" |
*
* @param {Source_CursorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor: ((inputs?: Source_CursorInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_CursorInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "not set" |
*
* @param {Source_Cursor_AbsentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor_absent: ((inputs?: Source_Cursor_AbsentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Cursor_AbsentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "set" |
*
* @param {Source_Cursor_PresentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor_present: ((inputs?: Source_Cursor_PresentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Cursor_PresentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Disable" |
*
* @param {Source_DisableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_disable: ((inputs?: Source_DisableInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_DisableInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Enable" |
*
* @param {Source_EnableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enable: ((inputs?: Source_EnableInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_EnableInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "State" |
*
* @param {Source_EnabledInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enabled: ((inputs?: Source_EnabledInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_EnabledInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Disabled" |
*
* @param {Source_Enabled_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enabled_no: ((inputs?: Source_Enabled_NoInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Enabled_NoInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Enabled" |
*
* @param {Source_Enabled_YesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enabled_yes: ((inputs?: Source_Enabled_YesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Enabled_YesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Kind" |
*
* @param {Source_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind: ((inputs?: Source_KindInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_KindInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "REST API" |
*
* @param {Source_Kind_ApiInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind_api: ((inputs?: Source_Kind_ApiInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Kind_ApiInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "CSV files" |
*
* @param {Source_Kind_CsvInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind_csv: ((inputs?: Source_Kind_CsvInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Kind_CsvInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No sources configured." |
*
* @param {Source_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_none: ((inputs?: Source_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Run import" |
*
* @param {Source_RunInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_run: ((inputs?: Source_RunInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_RunInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The run has started - watch the import journal." |
*
* @param {Source_Run_StartedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_run_started: ((inputs?: Source_Run_StartedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Run_StartedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Schedule" |
*
* @param {Source_ScheduleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_schedule: ((inputs?: Source_ScheduleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_ScheduleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Cron expression; empty means manual runs only." |
*
* @param {Source_Schedule_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_schedule_hint: ((inputs?: Source_Schedule_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Schedule_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Reviewer e-mail" |
*
* @param {Staff_Unit_EmailInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_email: ((inputs?: Staff_Unit_EmailInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Unit_EmailInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The address is neither stored nor logged: the server keeps only an irreversible hash and a mask." |
*
* @param {Staff_Unit_Email_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_email_hint: ((inputs?: Staff_Unit_Email_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Unit_Email_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Masked address" |
*
* @param {Staff_Unit_MaskedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_masked: ((inputs?: Staff_Unit_MaskedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Unit_MaskedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No mappings defined." |
*
* @param {Staff_Unit_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_none: ((inputs?: Staff_Unit_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Unit_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Updated" |
*
* @param {Staff_Unit_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_updated: ((inputs?: Staff_Unit_UpdatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Unit_UpdatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Ties a reviewer to a faculty and department; the unit breakdown is built on it." |
*
* @param {Staff_Units_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_units_hint: ((inputs?: Staff_Units_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Units_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Reviewers and units" |
*
* @param {Staff_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_units_title: ((inputs?: Staff_Units_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Units_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Accepted" |
*
* @param {Status_AcceptedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_accepted: ((inputs?: Status_AcceptedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Status_AcceptedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Needs revision" |
*
* @param {Status_Needs_RevisionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_needs_revision: ((inputs?: Status_Needs_RevisionInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Status_Needs_RevisionInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Recheck" |
*
* @param {Status_RecheckInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_recheck: ((inputs?: Status_RecheckInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Status_RecheckInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Rejected" |
*
* @param {Status_RejectedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_rejected: ((inputs?: Status_RejectedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Status_RejectedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Actions" |
*
* @param {Table_ActionsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const table_actions: ((inputs?: Table_ActionsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Table_ActionsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The breakdown by unit follows the current reviewer-to-unit mapping; for past academic years it is approximate." |
*
* @param {Units_Coverage_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_coverage_footnote: ((inputs?: Units_Coverage_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Coverage_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "A faculty total includes departments whose own cells are suppressed, so the visible rows need not add up to it." |
*
* @param {Units_Margin_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_margin_footnote: ((inputs?: Units_Margin_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Margin_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No breakdown: your scope is a single unit, and its figures are above." |
*
* @param {Units_Own_Scope_OnlyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_own_scope_only: ((inputs?: Units_Own_Scope_OnlyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Own_Scope_OnlyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "The breakdown by unit becomes available once the mapping of reviewers to units has been loaded." |
*
* @param {Units_Pending_Mapping_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_pending_mapping_footnote: ((inputs?: Units_Pending_Mapping_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Pending_Mapping_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "A breakdown by study programme is not available yet." |
*
* @param {Units_Program_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_program_footnote: ((inputs?: Units_Program_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Program_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "«Unassigned» covers checks whose reviewing unit could not be resolved." |
*
* @param {Units_Unassigned_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_unassigned_footnote: ((inputs?: Units_Unassigned_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Unassigned_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Average check duration" |
*
* @param {Usage_Avg_DurationInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_avg_duration: ((inputs?: Usage_Avg_DurationInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Usage_Avg_DurationInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Entered by hand by the compliance office; the source export does not carry it." |
*
* @param {Usage_Avg_Duration_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_avg_duration_hint: ((inputs?: Usage_Avg_Duration_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Usage_Avg_Duration_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "no data" |
*
* @param {Usage_No_DataInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_no_data: ((inputs?: Usage_No_DataInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Usage_No_DataInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "{value} s" |
*
* @param {Usage_SecondsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_seconds: ((inputs: Usage_SecondsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Usage_SecondsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Derive the work type from the document title." |
*
* @param {Work_Type_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_type_rules_hint: ((inputs?: Work_Type_Rules_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Work_Type_Rules_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "Work-type rules" |
*
* @param {Work_Type_Rules_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_type_rules_title: ((inputs?: Work_Type_Rules_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Work_Type_Rules_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
/**
* | output |
* | --- |
* | "No breakdown by work type is available: the source export carries no work-type field, and fewer than one per cent of checks can be classified from the docume..." |
*
* @param {Work_Types_Single_BucketInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_types_single_bucket: ((inputs?: Work_Types_Single_BucketInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Work_Types_Single_BucketInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Action_AddInputs = {};
export type Action_DeleteInputs = {};
export type Action_SaveInputs = {};
export type Admin_AuditInputs = {};
export type Admin_Audit_HintInputs = {};
export type Admin_Batch_RowsInputs = {
    read: NonNullable<unknown>;
    upserted: NonNullable<unknown>;
    rejected: NonNullable<unknown>;
};
export type Admin_Batch_StaleInputs = {
    hours: NonNullable<unknown>;
};
export type Admin_CountsInputs = {};
export type Admin_Counts_HintInputs = {};
export type Admin_DictionariesInputs = {};
export type Admin_Last_BatchInputs = {};
export type Admin_Last_Batch_HintInputs = {};
export type Admin_Nav_AreasInputs = {};
export type Admin_OverviewInputs = {};
export type Admin_Quick_LinksInputs = {};
export type Admin_ReportsInputs = {};
export type Admin_Reports_HintInputs = {};
export type Admin_Reports_UnpublishedInputs = {};
export type Admin_RolesInputs = {};
export type Admin_Roles_HintInputs = {};
export type Admin_SettingsInputs = {};
export type Admin_Settings_HintInputs = {};
export type Admin_SourcesInputs = {};
export type Admin_Sources_HintInputs = {};
export type Admin_TitleInputs = {};
export type Alias_KindInputs = {};
export type Alias_NoneInputs = {};
export type Alias_Source_LabelInputs = {};
export type Alias_TargetInputs = {};
export type Alias_Target_CodeInputs = {};
export type Aliases_HintInputs = {};
export type Aliases_TitleInputs = {};
export type App_Error_BodyInputs = {};
export type App_Error_HomeInputs = {};
export type App_Error_TitleInputs = {};
export type App_TitleInputs = {};
export type App_Title_FullInputs = {};
export type Audit_ActionInputs = {};
export type Audit_Action_Admin_ChangeInputs = {};
export type Audit_Action_Export_PdfInputs = {};
export type Audit_Action_Export_XlsxInputs = {};
export type Audit_Action_ViewInputs = {};
export type Audit_AnyInputs = {};
export type Audit_FiltersInputs = {};
export type Audit_FooterInputs = {
    total: NonNullable<unknown>;
    days: NonNullable<unknown>;
};
export type Audit_IpInputs = {};
export type Audit_NoneInputs = {};
export type Audit_RoleInputs = {};
export type Audit_SectionInputs = {};
export type Audit_TimeInputs = {};
export type Audit_UserInputs = {};
export type Batch_Errors_EmptyInputs = {};
export type Batch_Errors_HideInputs = {};
export type Batch_Errors_ShowInputs = {};
export type Batch_Errors_TitleInputs = {
    id: NonNullable<unknown>;
};
export type Batch_Rows_ReadInputs = {};
export type Batch_Rows_RejectedInputs = {};
export type Batch_Rows_SkippedInputs = {};
export type Batch_Rows_UpsertedInputs = {};
export type Batch_SourceInputs = {};
export type Batch_StartedInputs = {};
export type Batch_StatusInputs = {};
export type Batch_Status_FailedInputs = {};
export type Batch_Status_RunningInputs = {};
export type Batch_Status_SucceededInputs = {};
export type Batches_EmptyInputs = {};
export type Batches_HintInputs = {};
export type Batches_TitleInputs = {};
export type Brand_LockupInputs = {};
export type Chart_Axis_Academic_YearInputs = {};
export type Chart_Axis_Active_ReviewersInputs = {};
export type Chart_Axis_CategoryInputs = {};
export type Chart_Axis_CountInputs = {};
export type Chart_Axis_FacultyInputs = {};
export type Chart_Axis_MonthInputs = {};
export type Chart_Axis_OriginalityInputs = {};
export type Chart_Axis_ShareInputs = {};
export type Chart_Axis_ValueInputs = {};
export type Chart_Axis_Work_TypeInputs = {};
export type Chart_Bucket_50_70Inputs = {};
export type Chart_Bucket_70_85Inputs = {};
export type Chart_Bucket_85_95Inputs = {};
export type Chart_Bucket_Gte_95Inputs = {};
export type Chart_Bucket_Lt_50Inputs = {};
export type Chart_Data_TableInputs = {};
export type Chart_Dynamics_Flags_TitleInputs = {};
export type Chart_Dynamics_TitleInputs = {};
export type Chart_EmptyInputs = {};
export type Chart_Faculties_TitleInputs = {};
export type Chart_Heatmap_ScaleInputs = {};
export type Chart_Heatmap_UnitInputs = {};
export type Chart_Histogram_BucketInputs = {};
export type Chart_Histogram_TitleInputs = {};
export type Chart_Kpi_Delta_DownInputs = {
    delta: NonNullable<unknown>;
};
export type Chart_Kpi_Delta_FlatInputs = {};
export type Chart_Kpi_Delta_UpInputs = {
    delta: NonNullable<unknown>;
};
export type Chart_Kpi_PreviousInputs = {};
export type Chart_Kpi_SparklineInputs = {};
export type Chart_LegendInputs = {};
export type Chart_Semester_AutumnInputs = {
    year: NonNullable<unknown>;
};
export type Chart_Semester_BandsInputs = {};
export type Chart_Semester_ShadingInputs = {};
export type Chart_Semester_SpringInputs = {
    year: NonNullable<unknown>;
};
export type Chart_Series_Active_ReviewersInputs = {};
export type Chart_Series_ChecksInputs = {};
export type Chart_Series_EscalatedInputs = {};
export type Chart_Series_OriginalityInputs = {};
export type Chart_Series_RechecksInputs = {};
export type Chart_Suppressed_NoteInputs = {
    count: NonNullable<unknown>;
    total: NonNullable<unknown>;
};
export type Chart_Units_TitleInputs = {};
export type Chart_Usage_TitleInputs = {};
export type Chart_Work_Types_CountsInputs = {};
export type Chart_Work_Types_OriginalityInputs = {};
export type Confirm_DeleteInputs = {};
export type Confirm_Revoke_RoleInputs = {};
export type Confirm_Unpublish_ReportInputs = {};
export type Dict_ActiveInputs = {};
export type Dict_Active_NoInputs = {};
export type Dict_Active_YesInputs = {};
export type Dict_CodeInputs = {};
export type Dict_Code_HintInputs = {};
export type Dict_EntriesInputs = {};
export type Dict_Entries_HintInputs = {};
export type Dict_Name_EnInputs = {};
export type Dict_Name_KkInputs = {};
export type Dict_Name_RuInputs = {};
export type Dict_NoneInputs = {};
export type Dict_ParentInputs = {};
export type Dict_Parent_NoneInputs = {};
export type Dict_Sort_OrderInputs = {};
export type Dict_Tab_DepartmentsInputs = {};
export type Dict_Tab_FacultiesInputs = {};
export type Dict_Tab_ProgramsInputs = {};
export type Dict_Tab_Work_TypesInputs = {};
export type Embed_TitleInputs = {};
export type Error_Out_Of_ScopeInputs = {};
export type Error_Role_DeniedInputs = {};
export type Error_Session_ExpiredInputs = {};
export type Escalations_Units_NoteInputs = {};
export type Escalations_Units_TitleInputs = {};
export type Ethics_Cases_EmptyInputs = {};
export type Ethics_Cases_TitleInputs = {};
export type Ethics_CategoryInputs = {};
export type Ethics_ClosedInputs = {};
export type Ethics_ReferredInputs = {};
export type Ethics_YearInputs = {};
export type Export_BusyInputs = {};
export type Export_ErrorInputs = {};
export type Export_Official_UseInputs = {};
export type Export_PdfInputs = {};
export type Export_Public_HintInputs = {};
export type Export_TitleInputs = {};
export type Export_XlsxInputs = {};
export type Filter_All_DepartmentsInputs = {};
export type Filter_All_FacultiesInputs = {};
export type Filter_All_StatusesInputs = {};
export type Filter_All_Work_TypesInputs = {};
export type Filter_Bar_TitleInputs = {};
export type Filter_DepartmentInputs = {};
export type Filter_FacultyInputs = {};
export type Filter_FromInputs = {};
export type Filter_PeriodInputs = {};
export type Filter_Period_3yInputs = {};
export type Filter_Period_5yInputs = {};
export type Filter_Period_CustomInputs = {};
export type Filter_Period_MonthInputs = {};
export type Filter_Period_SemesterInputs = {};
export type Filter_Period_ShownInputs = {
    from: NonNullable<unknown>;
    to: NonNullable<unknown>;
};
export type Filter_Period_YearInputs = {};
export type Filter_ProgramInputs = {};
export type Filter_Program_HintInputs = {};
export type Filter_Program_PlaceholderInputs = {};
export type Filter_ResetInputs = {};
export type Filter_StatusInputs = {};
export type Filter_ToInputs = {};
export type Filter_Work_TypeInputs = {};
export type Footer_About_BodyInputs = {};
export type Footer_About_TitleInputs = {};
export type Footer_Sections_TitleInputs = {};
export type Footer_Staff_LinkInputs = {};
export type Footer_UpdatedInputs = {};
export type Form_ErrorInputs = {};
export type Form_Invalid_EmailInputs = {};
export type Form_Invalid_JsonInputs = {};
export type Form_Invalid_NumberInputs = {};
export type Form_RequiredInputs = {};
export type Form_SavedInputs = {};
export type Form_SavingInputs = {};
export type Header_Locale_LabelInputs = {};
export type Header_Skip_LinkInputs = {};
export type Initiator_OtherInputs = {};
export type Initiator_RegistrarInputs = {};
export type Initiator_Rules_HintInputs = {};
export type Initiator_Rules_TitleInputs = {};
export type Initiator_Staff_SelfInputs = {};
export type Initiator_StudentInputs = {};
export type Insufficient_DataInputs = {};
export type Internal_Contour_TitleInputs = {};
export type Internal_Nav_OtherInputs = {};
export type Internal_Nav_PublicInputs = {};
export type Internal_Nav_SectionsInputs = {};
export type Internal_Nav_ToggleInputs = {};
export type Internal_Overview_HintInputs = {};
export type K_Threshold_NoteInputs = {
    k: NonNullable<unknown>;
};
export type Kpi_Avg_OriginalityInputs = {};
export type Kpi_Avg_Originality_HintInputs = {};
export type Kpi_Below_ThresholdInputs = {};
export type Kpi_Below_Threshold_HintInputs = {
    count: NonNullable<unknown>;
};
export type Kpi_CoverageInputs = {};
export type Kpi_Coverage_HintInputs = {};
export type Kpi_EscalatedInputs = {};
export type Kpi_Escalated_HintInputs = {};
export type Kpi_Escalated_ShareInputs = {};
export type Kpi_Escalated_Share_HintInputs = {};
export type Kpi_ImprovedInputs = {};
export type Kpi_Improved_ShareInputs = {};
export type Kpi_Improved_Share_HintInputs = {
    count: NonNullable<unknown>;
};
export type Kpi_Recheck_ShareInputs = {};
export type Kpi_Recheck_Share_HintInputs = {};
export type Kpi_Total_ChecksInputs = {};
export type Kpi_Total_Checks_HintInputs = {};
export type Kpi_Works_RecheckedInputs = {};
export type Kpi_Works_Rechecked_HintInputs = {};
export type Kpi_Works_TotalInputs = {};
export type Kpi_Works_Total_HintInputs = {};
export type Locale_Name_EnInputs = {};
export type Locale_Name_KkInputs = {};
export type Locale_Name_RuInputs = {};
export type Login_FailedInputs = {};
export type Login_HintInputs = {};
export type Login_No_AccountInputs = {};
export type Login_PasswordInputs = {};
export type Login_SubmitInputs = {};
export type Login_ThrottledInputs = {};
export type Login_TitleInputs = {};
export type Login_UsernameInputs = {};
export type Logout_ButtonInputs = {};
export type Not_Found_TitleInputs = {};
export type Public_Contour_TitleInputs = {};
export type Rechecks_Units_TitleInputs = {};
export type Report_FilesInputs = {};
export type Report_Files_After_PublishInputs = {};
export type Report_GenerateInputs = {};
export type Report_Generate_HintInputs = {};
export type Report_Generated_AtInputs = {};
export type Report_Generated_OkInputs = {};
export type Report_KindInputs = {};
export type Report_LocaleInputs = {};
export type Report_NoneInputs = {};
export type Report_PeriodInputs = {};
export type Report_PublishInputs = {};
export type Report_PublishedInputs = {};
export type Report_Published_StateInputs = {};
export type Report_UnpublishInputs = {};
export type Report_UnpublishedInputs = {};
export type Reports_DownloadInputs = {
    format: NonNullable<unknown>;
};
export type Reports_EmptyInputs = {};
export type Reports_GeneratedInputs = {
    date: NonNullable<unknown>;
};
export type Reports_Kind_AnnualInputs = {};
export type Reports_Kind_ManualInputs = {};
export type Request_Access_AccountInputs = {};
export type Request_Access_BackInputs = {};
export type Request_Access_BodyInputs = {};
export type Request_Access_Staff_NoteInputs = {};
export type Request_Access_Step_AdminInputs = {};
export type Request_Access_Step_HeadInputs = {};
export type Request_Access_Step_SigninInputs = {};
export type Request_Access_TitleInputs = {};
export type Role_AdminInputs = {};
export type Role_ComplianceInputs = {};
export type Role_DeanInputs = {};
export type Role_Dept_HeadInputs = {};
export type Role_EthicsInputs = {};
export type Role_NoneInputs = {};
export type Role_StaffInputs = {};
export type Roles_AccountInputs = {};
export type Roles_ActiveInputs = {};
export type Roles_Active_NoInputs = {};
export type Roles_Active_YesInputs = {};
export type Roles_GrantInputs = {};
export type Roles_Grant_HintInputs = {};
export type Roles_Grant_SubmitInputs = {};
export type Roles_GrantsInputs = {};
export type Roles_NoneInputs = {};
export type Roles_RevokeInputs = {};
export type Roles_RoleInputs = {};
export type Roles_Scope_DepartmentInputs = {};
export type Roles_Scope_Department_RequiredInputs = {};
export type Roles_Scope_FacultyInputs = {};
export type Roles_Scope_Faculty_RequiredInputs = {};
export type Roles_Scope_NoneInputs = {};
export type Roles_SubjectInputs = {};
export type Rule_ActivateInputs = {};
export type Rule_ActiveInputs = {};
export type Rule_DeactivateInputs = {};
export type Rule_InitiatorInputs = {};
export type Rule_NoneInputs = {};
export type Rule_PatternInputs = {};
export type Rule_Pattern_HintInputs = {};
export type Rule_PriorityInputs = {};
export type Rule_Priority_HintInputs = {};
export type Rule_Regex_HintInputs = {};
export type Rule_Work_TypeInputs = {};
export type Scope_AllInputs = {};
export type Scope_DepartmentInputs = {};
export type Scope_FacultyInputs = {};
export type Scope_NoneInputs = {};
export type Section_DynamicsInputs = {};
export type Section_Dynamics_HintInputs = {};
export type Section_Error_TitleInputs = {};
export type Section_Error_UnavailableInputs = {};
export type Section_EscalationsInputs = {};
export type Section_Escalations_HintInputs = {};
export type Section_FacultiesInputs = {};
export type Section_Faculties_HintInputs = {};
export type Section_HistogramInputs = {};
export type Section_Histogram_HintInputs = {};
export type Section_In_DevelopmentInputs = {
    section: NonNullable<unknown>;
};
export type Section_LoadingInputs = {};
export type Section_OverviewInputs = {};
export type Section_Overview_HintInputs = {};
export type Section_RechecksInputs = {};
export type Section_Rechecks_HintInputs = {};
export type Section_ReportsInputs = {};
export type Section_Reports_HintInputs = {};
export type Section_RetryInputs = {};
export type Section_Role_RestrictedInputs = {};
export type Section_UnitsInputs = {};
export type Section_Units_HintInputs = {};
export type Section_UsageInputs = {};
export type Section_Usage_HintInputs = {};
export type Section_Work_TypesInputs = {};
export type Section_Work_Types_HintInputs = {};
export type Section_YoyInputs = {};
export type Section_Yoy_HintInputs = {};
export type Setting_Autumn_StartInputs = {};
export type Setting_Exclude_DeletedInputs = {};
export type Setting_Exclude_Deleted_HintInputs = {};
export type Setting_Histogram_BucketsInputs = {};
export type Setting_Histogram_Buckets_HintInputs = {};
export type Setting_Histogram_Buckets_InvalidInputs = {};
export type Setting_K_ThresholdInputs = {};
export type Setting_K_Threshold_HintInputs = {};
export type Setting_Originality_ThresholdInputs = {};
export type Setting_Originality_Threshold_HintInputs = {};
export type Setting_Semester_HintInputs = {};
export type Setting_Snapshot_QuarterInputs = {};
export type Setting_Snapshot_Quarter_HintInputs = {};
export type Setting_Spring_StartInputs = {};
export type Setting_Status_RulesInputs = {};
export type Setting_Status_Rules_HintInputs = {};
export type Settings_SaveInputs = {};
export type Settings_Saved_HintInputs = {};
export type Settings_UnchangedInputs = {};
export type Settings_UpdatedInputs = {
    date: NonNullable<unknown>;
    who: NonNullable<unknown>;
};
export type Settings_Updated_By_SystemInputs = {};
export type Source_Base_UrlInputs = {};
export type Source_Base_Url_HintInputs = {};
export type Source_CursorInputs = {};
export type Source_Cursor_AbsentInputs = {};
export type Source_Cursor_PresentInputs = {};
export type Source_DisableInputs = {};
export type Source_EnableInputs = {};
export type Source_EnabledInputs = {};
export type Source_Enabled_NoInputs = {};
export type Source_Enabled_YesInputs = {};
export type Source_KindInputs = {};
export type Source_Kind_ApiInputs = {};
export type Source_Kind_CsvInputs = {};
export type Source_NoneInputs = {};
export type Source_RunInputs = {};
export type Source_Run_StartedInputs = {};
export type Source_ScheduleInputs = {};
export type Source_Schedule_HintInputs = {};
export type Staff_Unit_EmailInputs = {};
export type Staff_Unit_Email_HintInputs = {};
export type Staff_Unit_MaskedInputs = {};
export type Staff_Unit_NoneInputs = {};
export type Staff_Unit_UpdatedInputs = {};
export type Staff_Units_HintInputs = {};
export type Staff_Units_TitleInputs = {};
export type Status_AcceptedInputs = {};
export type Status_Needs_RevisionInputs = {};
export type Status_RecheckInputs = {};
export type Status_RejectedInputs = {};
export type Table_ActionsInputs = {};
export type Units_Coverage_FootnoteInputs = {};
export type Units_Margin_FootnoteInputs = {};
export type Units_Own_Scope_OnlyInputs = {};
export type Units_Pending_Mapping_FootnoteInputs = {};
export type Units_Program_FootnoteInputs = {};
export type Units_Unassigned_FootnoteInputs = {};
export type Usage_Avg_DurationInputs = {};
export type Usage_Avg_Duration_HintInputs = {};
export type Usage_No_DataInputs = {};
export type Usage_SecondsInputs = {
    value: NonNullable<unknown>;
};
export type Work_Type_Rules_HintInputs = {};
export type Work_Type_Rules_TitleInputs = {};
export type Work_Types_Single_BucketInputs = {};
