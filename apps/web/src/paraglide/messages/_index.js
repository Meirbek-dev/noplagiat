/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{}} Action_AddInputs */
/** @typedef {{}} Action_DeleteInputs */
/** @typedef {{}} Action_SaveInputs */
/** @typedef {{}} Admin_AuditInputs */
/** @typedef {{}} Admin_Audit_HintInputs */
/** @typedef {{ read: NonNullable<unknown>, upserted: NonNullable<unknown>, rejected: NonNullable<unknown> }} Admin_Batch_RowsInputs */
/** @typedef {{ hours: NonNullable<unknown> }} Admin_Batch_StaleInputs */
/** @typedef {{}} Admin_CountsInputs */
/** @typedef {{}} Admin_Counts_HintInputs */
/** @typedef {{}} Admin_DictionariesInputs */
/** @typedef {{}} Admin_Last_BatchInputs */
/** @typedef {{}} Admin_Last_Batch_HintInputs */
/** @typedef {{}} Admin_Nav_AreasInputs */
/** @typedef {{}} Admin_OverviewInputs */
/** @typedef {{}} Admin_Quick_LinksInputs */
/** @typedef {{}} Admin_ReportsInputs */
/** @typedef {{}} Admin_Reports_HintInputs */
/** @typedef {{}} Admin_Reports_UnpublishedInputs */
/** @typedef {{}} Admin_RolesInputs */
/** @typedef {{}} Admin_Roles_HintInputs */
/** @typedef {{}} Admin_SettingsInputs */
/** @typedef {{}} Admin_Settings_HintInputs */
/** @typedef {{}} Admin_SourcesInputs */
/** @typedef {{}} Admin_Sources_HintInputs */
/** @typedef {{}} Admin_TitleInputs */
/** @typedef {{}} Alias_KindInputs */
/** @typedef {{}} Alias_NoneInputs */
/** @typedef {{}} Alias_Source_LabelInputs */
/** @typedef {{}} Alias_TargetInputs */
/** @typedef {{}} Alias_Target_CodeInputs */
/** @typedef {{}} Aliases_HintInputs */
/** @typedef {{}} Aliases_TitleInputs */
/** @typedef {{}} App_Error_BodyInputs */
/** @typedef {{}} App_Error_HomeInputs */
/** @typedef {{}} App_Error_TitleInputs */
/** @typedef {{}} App_TitleInputs */
/** @typedef {{}} App_Title_FullInputs */
/** @typedef {{}} Audit_ActionInputs */
/** @typedef {{}} Audit_Action_Admin_ChangeInputs */
/** @typedef {{}} Audit_Action_Export_PdfInputs */
/** @typedef {{}} Audit_Action_Export_XlsxInputs */
/** @typedef {{}} Audit_Action_ViewInputs */
/** @typedef {{}} Audit_AnyInputs */
/** @typedef {{}} Audit_FiltersInputs */
/** @typedef {{ total: NonNullable<unknown>, days: NonNullable<unknown> }} Audit_FooterInputs */
/** @typedef {{}} Audit_IpInputs */
/** @typedef {{}} Audit_NoneInputs */
/** @typedef {{}} Audit_RoleInputs */
/** @typedef {{}} Audit_SectionInputs */
/** @typedef {{}} Audit_TimeInputs */
/** @typedef {{}} Audit_UserInputs */
/** @typedef {{}} Batch_Errors_EmptyInputs */
/** @typedef {{}} Batch_Errors_HideInputs */
/** @typedef {{}} Batch_Errors_ShowInputs */
/** @typedef {{ id: NonNullable<unknown> }} Batch_Errors_TitleInputs */
/** @typedef {{}} Batch_Rows_ReadInputs */
/** @typedef {{}} Batch_Rows_RejectedInputs */
/** @typedef {{}} Batch_Rows_SkippedInputs */
/** @typedef {{}} Batch_Rows_UpsertedInputs */
/** @typedef {{}} Batch_SourceInputs */
/** @typedef {{}} Batch_StartedInputs */
/** @typedef {{}} Batch_StatusInputs */
/** @typedef {{}} Batch_Status_FailedInputs */
/** @typedef {{}} Batch_Status_RunningInputs */
/** @typedef {{}} Batch_Status_SucceededInputs */
/** @typedef {{}} Batches_EmptyInputs */
/** @typedef {{}} Batches_HintInputs */
/** @typedef {{}} Batches_TitleInputs */
/** @typedef {{}} Brand_LockupInputs */
/** @typedef {{}} Chart_Axis_Academic_YearInputs */
/** @typedef {{}} Chart_Axis_Active_ReviewersInputs */
/** @typedef {{}} Chart_Axis_CategoryInputs */
/** @typedef {{}} Chart_Axis_CountInputs */
/** @typedef {{}} Chart_Axis_FacultyInputs */
/** @typedef {{}} Chart_Axis_MonthInputs */
/** @typedef {{}} Chart_Axis_OriginalityInputs */
/** @typedef {{}} Chart_Axis_ShareInputs */
/** @typedef {{}} Chart_Axis_ValueInputs */
/** @typedef {{}} Chart_Axis_Work_TypeInputs */
/** @typedef {{}} Chart_Bucket_50_70Inputs */
/** @typedef {{}} Chart_Bucket_70_85Inputs */
/** @typedef {{}} Chart_Bucket_85_95Inputs */
/** @typedef {{}} Chart_Bucket_Gte_95Inputs */
/** @typedef {{}} Chart_Bucket_Lt_50Inputs */
/** @typedef {{}} Chart_Data_TableInputs */
/** @typedef {{}} Chart_Dynamics_Flags_TitleInputs */
/** @typedef {{}} Chart_Dynamics_TitleInputs */
/** @typedef {{}} Chart_EmptyInputs */
/** @typedef {{}} Chart_Faculties_TitleInputs */
/** @typedef {{}} Chart_Heatmap_ScaleInputs */
/** @typedef {{}} Chart_Heatmap_UnitInputs */
/** @typedef {{}} Chart_Histogram_BucketInputs */
/** @typedef {{}} Chart_Histogram_TitleInputs */
/** @typedef {{ delta: NonNullable<unknown> }} Chart_Kpi_Delta_DownInputs */
/** @typedef {{}} Chart_Kpi_Delta_FlatInputs */
/** @typedef {{ delta: NonNullable<unknown> }} Chart_Kpi_Delta_UpInputs */
/** @typedef {{}} Chart_Kpi_PreviousInputs */
/** @typedef {{}} Chart_Kpi_SparklineInputs */
/** @typedef {{}} Chart_LegendInputs */
/** @typedef {{ year: NonNullable<unknown> }} Chart_Semester_AutumnInputs */
/** @typedef {{}} Chart_Semester_BandsInputs */
/** @typedef {{}} Chart_Semester_ShadingInputs */
/** @typedef {{ year: NonNullable<unknown> }} Chart_Semester_SpringInputs */
/** @typedef {{}} Chart_Series_Active_ReviewersInputs */
/** @typedef {{}} Chart_Series_ChecksInputs */
/** @typedef {{}} Chart_Series_EscalatedInputs */
/** @typedef {{}} Chart_Series_OriginalityInputs */
/** @typedef {{}} Chart_Series_RechecksInputs */
/** @typedef {{ count: NonNullable<unknown>, total: NonNullable<unknown> }} Chart_Suppressed_NoteInputs */
/** @typedef {{}} Chart_Units_TitleInputs */
/** @typedef {{}} Chart_Usage_TitleInputs */
/** @typedef {{}} Chart_Work_Types_CountsInputs */
/** @typedef {{}} Chart_Work_Types_OriginalityInputs */
/** @typedef {{}} Confirm_DeleteInputs */
/** @typedef {{}} Confirm_Revoke_RoleInputs */
/** @typedef {{}} Confirm_Unpublish_ReportInputs */
/** @typedef {{}} Dict_ActiveInputs */
/** @typedef {{}} Dict_Active_NoInputs */
/** @typedef {{}} Dict_Active_YesInputs */
/** @typedef {{}} Dict_CodeInputs */
/** @typedef {{}} Dict_Code_HintInputs */
/** @typedef {{}} Dict_EntriesInputs */
/** @typedef {{}} Dict_Entries_HintInputs */
/** @typedef {{}} Dict_Name_EnInputs */
/** @typedef {{}} Dict_Name_KkInputs */
/** @typedef {{}} Dict_Name_RuInputs */
/** @typedef {{}} Dict_NoneInputs */
/** @typedef {{}} Dict_ParentInputs */
/** @typedef {{}} Dict_Parent_NoneInputs */
/** @typedef {{}} Dict_Sort_OrderInputs */
/** @typedef {{}} Dict_Tab_DepartmentsInputs */
/** @typedef {{}} Dict_Tab_FacultiesInputs */
/** @typedef {{}} Dict_Tab_ProgramsInputs */
/** @typedef {{}} Dict_Tab_Work_TypesInputs */
/** @typedef {{}} Embed_TitleInputs */
/** @typedef {{}} Error_Out_Of_ScopeInputs */
/** @typedef {{}} Error_Role_DeniedInputs */
/** @typedef {{}} Error_Session_ExpiredInputs */
/** @typedef {{}} Escalations_Units_NoteInputs */
/** @typedef {{}} Escalations_Units_TitleInputs */
/** @typedef {{}} Ethics_Cases_EmptyInputs */
/** @typedef {{}} Ethics_Cases_TitleInputs */
/** @typedef {{}} Ethics_CategoryInputs */
/** @typedef {{}} Ethics_ClosedInputs */
/** @typedef {{}} Ethics_ReferredInputs */
/** @typedef {{}} Ethics_YearInputs */
/** @typedef {{}} Export_BusyInputs */
/** @typedef {{}} Export_ErrorInputs */
/** @typedef {{}} Export_Official_UseInputs */
/** @typedef {{}} Export_PdfInputs */
/** @typedef {{}} Export_Public_HintInputs */
/** @typedef {{}} Export_TitleInputs */
/** @typedef {{}} Export_XlsxInputs */
/** @typedef {{}} Filter_All_DepartmentsInputs */
/** @typedef {{}} Filter_All_FacultiesInputs */
/** @typedef {{}} Filter_All_StatusesInputs */
/** @typedef {{}} Filter_All_Work_TypesInputs */
/** @typedef {{}} Filter_Bar_TitleInputs */
/** @typedef {{}} Filter_DepartmentInputs */
/** @typedef {{}} Filter_FacultyInputs */
/** @typedef {{}} Filter_FromInputs */
/** @typedef {{}} Filter_PeriodInputs */
/** @typedef {{}} Filter_Period_3yInputs */
/** @typedef {{}} Filter_Period_5yInputs */
/** @typedef {{}} Filter_Period_CustomInputs */
/** @typedef {{}} Filter_Period_MonthInputs */
/** @typedef {{}} Filter_Period_SemesterInputs */
/** @typedef {{ from: NonNullable<unknown>, to: NonNullable<unknown> }} Filter_Period_ShownInputs */
/** @typedef {{}} Filter_Period_YearInputs */
/** @typedef {{}} Filter_ProgramInputs */
/** @typedef {{}} Filter_Program_HintInputs */
/** @typedef {{}} Filter_Program_PlaceholderInputs */
/** @typedef {{}} Filter_ResetInputs */
/** @typedef {{}} Filter_StatusInputs */
/** @typedef {{}} Filter_ToInputs */
/** @typedef {{}} Filter_Work_TypeInputs */
/** @typedef {{}} Footer_About_BodyInputs */
/** @typedef {{}} Footer_About_TitleInputs */
/** @typedef {{}} Footer_Sections_TitleInputs */
/** @typedef {{}} Footer_Staff_LinkInputs */
/** @typedef {{}} Footer_UpdatedInputs */
/** @typedef {{}} Form_ErrorInputs */
/** @typedef {{}} Form_Invalid_EmailInputs */
/** @typedef {{}} Form_Invalid_JsonInputs */
/** @typedef {{}} Form_Invalid_NumberInputs */
/** @typedef {{}} Form_RequiredInputs */
/** @typedef {{}} Form_SavedInputs */
/** @typedef {{}} Form_SavingInputs */
/** @typedef {{}} Header_Locale_LabelInputs */
/** @typedef {{}} Header_Skip_LinkInputs */
/** @typedef {{}} Initiator_OtherInputs */
/** @typedef {{}} Initiator_RegistrarInputs */
/** @typedef {{}} Initiator_Rules_HintInputs */
/** @typedef {{}} Initiator_Rules_TitleInputs */
/** @typedef {{}} Initiator_Staff_SelfInputs */
/** @typedef {{}} Initiator_StudentInputs */
/** @typedef {{}} Insufficient_DataInputs */
/** @typedef {{}} Internal_Contour_TitleInputs */
/** @typedef {{}} Internal_Nav_OtherInputs */
/** @typedef {{}} Internal_Nav_PublicInputs */
/** @typedef {{}} Internal_Nav_SectionsInputs */
/** @typedef {{}} Internal_Nav_ToggleInputs */
/** @typedef {{}} Internal_Overview_HintInputs */
/** @typedef {{ k: NonNullable<unknown> }} K_Threshold_NoteInputs */
/** @typedef {{}} Kpi_Avg_OriginalityInputs */
/** @typedef {{}} Kpi_Avg_Originality_HintInputs */
/** @typedef {{}} Kpi_Below_ThresholdInputs */
/** @typedef {{ count: NonNullable<unknown> }} Kpi_Below_Threshold_HintInputs */
/** @typedef {{}} Kpi_CoverageInputs */
/** @typedef {{}} Kpi_Coverage_HintInputs */
/** @typedef {{}} Kpi_EscalatedInputs */
/** @typedef {{}} Kpi_Escalated_HintInputs */
/** @typedef {{}} Kpi_Escalated_ShareInputs */
/** @typedef {{}} Kpi_Escalated_Share_HintInputs */
/** @typedef {{}} Kpi_ImprovedInputs */
/** @typedef {{}} Kpi_Improved_ShareInputs */
/** @typedef {{ count: NonNullable<unknown> }} Kpi_Improved_Share_HintInputs */
/** @typedef {{}} Kpi_Recheck_ShareInputs */
/** @typedef {{}} Kpi_Recheck_Share_HintInputs */
/** @typedef {{}} Kpi_Total_ChecksInputs */
/** @typedef {{}} Kpi_Total_Checks_HintInputs */
/** @typedef {{}} Kpi_Works_RecheckedInputs */
/** @typedef {{}} Kpi_Works_Rechecked_HintInputs */
/** @typedef {{}} Kpi_Works_TotalInputs */
/** @typedef {{}} Kpi_Works_Total_HintInputs */
/** @typedef {{}} Locale_Name_EnInputs */
/** @typedef {{}} Locale_Name_KkInputs */
/** @typedef {{}} Locale_Name_RuInputs */
/** @typedef {{}} Login_FailedInputs */
/** @typedef {{}} Login_HintInputs */
/** @typedef {{}} Login_No_AccountInputs */
/** @typedef {{}} Login_PasswordInputs */
/** @typedef {{}} Login_SubmitInputs */
/** @typedef {{}} Login_ThrottledInputs */
/** @typedef {{}} Login_TitleInputs */
/** @typedef {{}} Login_UsernameInputs */
/** @typedef {{}} Logout_ButtonInputs */
/** @typedef {{}} Not_Found_TitleInputs */
/** @typedef {{}} Public_Contour_TitleInputs */
/** @typedef {{}} Rechecks_Units_TitleInputs */
/** @typedef {{}} Report_FilesInputs */
/** @typedef {{}} Report_Files_After_PublishInputs */
/** @typedef {{}} Report_GenerateInputs */
/** @typedef {{}} Report_Generate_HintInputs */
/** @typedef {{}} Report_Generated_AtInputs */
/** @typedef {{}} Report_Generated_OkInputs */
/** @typedef {{}} Report_KindInputs */
/** @typedef {{}} Report_LocaleInputs */
/** @typedef {{}} Report_NoneInputs */
/** @typedef {{}} Report_PeriodInputs */
/** @typedef {{}} Report_PublishInputs */
/** @typedef {{}} Report_PublishedInputs */
/** @typedef {{}} Report_Published_StateInputs */
/** @typedef {{}} Report_UnpublishInputs */
/** @typedef {{}} Report_UnpublishedInputs */
/** @typedef {{ format: NonNullable<unknown> }} Reports_DownloadInputs */
/** @typedef {{}} Reports_EmptyInputs */
/** @typedef {{ date: NonNullable<unknown> }} Reports_GeneratedInputs */
/** @typedef {{}} Reports_Kind_AnnualInputs */
/** @typedef {{}} Reports_Kind_ManualInputs */
/** @typedef {{}} Request_Access_AccountInputs */
/** @typedef {{}} Request_Access_BackInputs */
/** @typedef {{}} Request_Access_BodyInputs */
/** @typedef {{}} Request_Access_Staff_NoteInputs */
/** @typedef {{}} Request_Access_Step_AdminInputs */
/** @typedef {{}} Request_Access_Step_HeadInputs */
/** @typedef {{}} Request_Access_Step_SigninInputs */
/** @typedef {{}} Request_Access_TitleInputs */
/** @typedef {{}} Role_AdminInputs */
/** @typedef {{}} Role_ComplianceInputs */
/** @typedef {{}} Role_DeanInputs */
/** @typedef {{}} Role_Dept_HeadInputs */
/** @typedef {{}} Role_EthicsInputs */
/** @typedef {{}} Role_NoneInputs */
/** @typedef {{}} Role_StaffInputs */
/** @typedef {{}} Roles_AccountInputs */
/** @typedef {{}} Roles_ActiveInputs */
/** @typedef {{}} Roles_Active_NoInputs */
/** @typedef {{}} Roles_Active_YesInputs */
/** @typedef {{}} Roles_GrantInputs */
/** @typedef {{}} Roles_Grant_HintInputs */
/** @typedef {{}} Roles_Grant_SubmitInputs */
/** @typedef {{}} Roles_GrantsInputs */
/** @typedef {{}} Roles_NoneInputs */
/** @typedef {{}} Roles_RevokeInputs */
/** @typedef {{}} Roles_RoleInputs */
/** @typedef {{}} Roles_Scope_DepartmentInputs */
/** @typedef {{}} Roles_Scope_Department_RequiredInputs */
/** @typedef {{}} Roles_Scope_FacultyInputs */
/** @typedef {{}} Roles_Scope_Faculty_RequiredInputs */
/** @typedef {{}} Roles_Scope_NoneInputs */
/** @typedef {{}} Roles_SubjectInputs */
/** @typedef {{}} Rule_ActivateInputs */
/** @typedef {{}} Rule_ActiveInputs */
/** @typedef {{}} Rule_DeactivateInputs */
/** @typedef {{}} Rule_InitiatorInputs */
/** @typedef {{}} Rule_NoneInputs */
/** @typedef {{}} Rule_PatternInputs */
/** @typedef {{}} Rule_Pattern_HintInputs */
/** @typedef {{}} Rule_PriorityInputs */
/** @typedef {{}} Rule_Priority_HintInputs */
/** @typedef {{}} Rule_Regex_HintInputs */
/** @typedef {{}} Rule_Work_TypeInputs */
/** @typedef {{}} Scope_AllInputs */
/** @typedef {{}} Scope_DepartmentInputs */
/** @typedef {{}} Scope_FacultyInputs */
/** @typedef {{}} Scope_NoneInputs */
/** @typedef {{}} Section_DynamicsInputs */
/** @typedef {{}} Section_Dynamics_HintInputs */
/** @typedef {{}} Section_Error_TitleInputs */
/** @typedef {{}} Section_Error_UnavailableInputs */
/** @typedef {{}} Section_EscalationsInputs */
/** @typedef {{}} Section_Escalations_HintInputs */
/** @typedef {{}} Section_FacultiesInputs */
/** @typedef {{}} Section_Faculties_HintInputs */
/** @typedef {{}} Section_HistogramInputs */
/** @typedef {{}} Section_Histogram_HintInputs */
/** @typedef {{ section: NonNullable<unknown> }} Section_In_DevelopmentInputs */
/** @typedef {{}} Section_LoadingInputs */
/** @typedef {{}} Section_OverviewInputs */
/** @typedef {{}} Section_Overview_HintInputs */
/** @typedef {{}} Section_RechecksInputs */
/** @typedef {{}} Section_Rechecks_HintInputs */
/** @typedef {{}} Section_ReportsInputs */
/** @typedef {{}} Section_Reports_HintInputs */
/** @typedef {{}} Section_RetryInputs */
/** @typedef {{}} Section_Role_RestrictedInputs */
/** @typedef {{}} Section_UnitsInputs */
/** @typedef {{}} Section_Units_HintInputs */
/** @typedef {{}} Section_UsageInputs */
/** @typedef {{}} Section_Usage_HintInputs */
/** @typedef {{}} Section_Work_TypesInputs */
/** @typedef {{}} Section_Work_Types_HintInputs */
/** @typedef {{}} Section_YoyInputs */
/** @typedef {{}} Section_Yoy_HintInputs */
/** @typedef {{}} Setting_Autumn_StartInputs */
/** @typedef {{}} Setting_Exclude_DeletedInputs */
/** @typedef {{}} Setting_Exclude_Deleted_HintInputs */
/** @typedef {{}} Setting_Histogram_BucketsInputs */
/** @typedef {{}} Setting_Histogram_Buckets_HintInputs */
/** @typedef {{}} Setting_Histogram_Buckets_InvalidInputs */
/** @typedef {{}} Setting_K_ThresholdInputs */
/** @typedef {{}} Setting_K_Threshold_HintInputs */
/** @typedef {{}} Setting_Originality_ThresholdInputs */
/** @typedef {{}} Setting_Originality_Threshold_HintInputs */
/** @typedef {{}} Setting_Semester_HintInputs */
/** @typedef {{}} Setting_Snapshot_QuarterInputs */
/** @typedef {{}} Setting_Snapshot_Quarter_HintInputs */
/** @typedef {{}} Setting_Spring_StartInputs */
/** @typedef {{}} Setting_Status_RulesInputs */
/** @typedef {{}} Setting_Status_Rules_HintInputs */
/** @typedef {{}} Settings_SaveInputs */
/** @typedef {{}} Settings_Saved_HintInputs */
/** @typedef {{}} Settings_UnchangedInputs */
/** @typedef {{ date: NonNullable<unknown>, who: NonNullable<unknown> }} Settings_UpdatedInputs */
/** @typedef {{}} Settings_Updated_By_SystemInputs */
/** @typedef {{}} Source_Base_UrlInputs */
/** @typedef {{}} Source_Base_Url_HintInputs */
/** @typedef {{}} Source_CursorInputs */
/** @typedef {{}} Source_Cursor_AbsentInputs */
/** @typedef {{}} Source_Cursor_PresentInputs */
/** @typedef {{}} Source_DisableInputs */
/** @typedef {{}} Source_EnableInputs */
/** @typedef {{}} Source_EnabledInputs */
/** @typedef {{}} Source_Enabled_NoInputs */
/** @typedef {{}} Source_Enabled_YesInputs */
/** @typedef {{}} Source_KindInputs */
/** @typedef {{}} Source_Kind_ApiInputs */
/** @typedef {{}} Source_Kind_CsvInputs */
/** @typedef {{}} Source_NoneInputs */
/** @typedef {{}} Source_RunInputs */
/** @typedef {{}} Source_Run_StartedInputs */
/** @typedef {{}} Source_ScheduleInputs */
/** @typedef {{}} Source_Schedule_HintInputs */
/** @typedef {{}} Staff_Unit_EmailInputs */
/** @typedef {{}} Staff_Unit_Email_HintInputs */
/** @typedef {{}} Staff_Unit_MaskedInputs */
/** @typedef {{}} Staff_Unit_NoneInputs */
/** @typedef {{}} Staff_Unit_UpdatedInputs */
/** @typedef {{}} Staff_Units_HintInputs */
/** @typedef {{}} Staff_Units_TitleInputs */
/** @typedef {{}} Status_AcceptedInputs */
/** @typedef {{}} Status_Needs_RevisionInputs */
/** @typedef {{}} Status_RecheckInputs */
/** @typedef {{}} Status_RejectedInputs */
/** @typedef {{}} Table_ActionsInputs */
/** @typedef {{}} Units_Coverage_FootnoteInputs */
/** @typedef {{}} Units_Margin_FootnoteInputs */
/** @typedef {{}} Units_Own_Scope_OnlyInputs */
/** @typedef {{}} Units_Pending_Mapping_FootnoteInputs */
/** @typedef {{}} Units_Program_FootnoteInputs */
/** @typedef {{}} Units_Unassigned_FootnoteInputs */
/** @typedef {{}} Usage_Avg_DurationInputs */
/** @typedef {{}} Usage_Avg_Duration_HintInputs */
/** @typedef {{}} Usage_No_DataInputs */
/** @typedef {{ value: NonNullable<unknown> }} Usage_SecondsInputs */
/** @typedef {{}} Work_Type_Rules_HintInputs */
/** @typedef {{}} Work_Type_Rules_TitleInputs */
/** @typedef {{}} Work_Types_Single_BucketInputs */
import * as __ru from "./ru.js"
import * as __kk from "./kk.js"
import * as __en from "./en.js"
/**
* | output |
* | --- |
* | "Add" |
*
* @param {Action_AddInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const action_add = /** @type {((inputs?: Action_AddInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_AddInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.action_add(inputs)
	if (locale === "en") return __en.action_add(inputs)
	return __ru.action_add(inputs)
});
/**
* | output |
* | --- |
* | "Delete" |
*
* @param {Action_DeleteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const action_delete = /** @type {((inputs?: Action_DeleteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_DeleteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.action_delete(inputs)
	if (locale === "en") return __en.action_delete(inputs)
	return __ru.action_delete(inputs)
});
/**
* | output |
* | --- |
* | "Save" |
*
* @param {Action_SaveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const action_save = /** @type {((inputs?: Action_SaveInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_SaveInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.action_save(inputs)
	if (locale === "en") return __en.action_save(inputs)
	return __ru.action_save(inputs)
});
/**
* | output |
* | --- |
* | "Access log" |
*
* @param {Admin_AuditInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_audit = /** @type {((inputs?: Admin_AuditInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_AuditInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_audit(inputs)
	if (locale === "en") return __en.admin_audit(inputs)
	return __ru.admin_audit(inputs)
});
/**
* | output |
* | --- |
* | "Every access to the internal contour: who, when, which section, and with which filters." |
*
* @param {Admin_Audit_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_audit_hint = /** @type {((inputs?: Admin_Audit_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Audit_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_audit_hint(inputs)
	if (locale === "en") return __en.admin_audit_hint(inputs)
	return __ru.admin_audit_hint(inputs)
});
/**
* | output |
* | --- |
* | "Read: {read} · upserted: {upserted} · rejected: {rejected}" |
*
* @param {Admin_Batch_RowsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_batch_rows = /** @type {((inputs: Admin_Batch_RowsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Batch_RowsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_batch_rows(inputs)
	if (locale === "en") return __en.admin_batch_rows(inputs)
	return __ru.admin_batch_rows(inputs)
});
/**
* | output |
* | --- |
* | "No refresh for {hours} h" |
*
* @param {Admin_Batch_StaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_batch_stale = /** @type {((inputs: Admin_Batch_StaleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Batch_StaleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_batch_stale(inputs)
	if (locale === "en") return __en.admin_batch_stale(inputs)
	return __ru.admin_batch_stale(inputs)
});
/**
* | output |
* | --- |
* | "Dictionaries and sources" |
*
* @param {Admin_CountsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_counts = /** @type {((inputs?: Admin_CountsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_CountsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_counts(inputs)
	if (locale === "en") return __en.admin_counts(inputs)
	return __ru.admin_counts(inputs)
});
/**
* | output |
* | --- |
* | "What the system currently holds." |
*
* @param {Admin_Counts_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_counts_hint = /** @type {((inputs?: Admin_Counts_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Counts_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_counts_hint(inputs)
	if (locale === "en") return __en.admin_counts_hint(inputs)
	return __ru.admin_counts_hint(inputs)
});
/**
* | output |
* | --- |
* | "Dictionaries" |
*
* @param {Admin_DictionariesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_dictionaries = /** @type {((inputs?: Admin_DictionariesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_DictionariesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_dictionaries(inputs)
	if (locale === "en") return __en.admin_dictionaries(inputs)
	return __ru.admin_dictionaries(inputs)
});
/**
* | output |
* | --- |
* | "Last import" |
*
* @param {Admin_Last_BatchInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_last_batch = /** @type {((inputs?: Admin_Last_BatchInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Last_BatchInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_last_batch(inputs)
	if (locale === "en") return __en.admin_last_batch(inputs)
	return __ru.admin_last_batch(inputs)
});
/**
* | output |
* | --- |
* | "The internal contour refreshes at least once a day." |
*
* @param {Admin_Last_Batch_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_last_batch_hint = /** @type {((inputs?: Admin_Last_Batch_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Last_Batch_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_last_batch_hint(inputs)
	if (locale === "en") return __en.admin_last_batch_hint(inputs)
	return __ru.admin_last_batch_hint(inputs)
});
/**
* | output |
* | --- |
* | "Administration areas" |
*
* @param {Admin_Nav_AreasInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_nav_areas = /** @type {((inputs?: Admin_Nav_AreasInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Nav_AreasInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_nav_areas(inputs)
	if (locale === "en") return __en.admin_nav_areas(inputs)
	return __ru.admin_nav_areas(inputs)
});
/**
* | output |
* | --- |
* | "Overview" |
*
* @param {Admin_OverviewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_overview = /** @type {((inputs?: Admin_OverviewInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_OverviewInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_overview(inputs)
	if (locale === "en") return __en.admin_overview(inputs)
	return __ru.admin_overview(inputs)
});
/**
* | output |
* | --- |
* | "Quick links" |
*
* @param {Admin_Quick_LinksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_quick_links = /** @type {((inputs?: Admin_Quick_LinksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Quick_LinksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_quick_links(inputs)
	if (locale === "en") return __en.admin_quick_links(inputs)
	return __ru.admin_quick_links(inputs)
});
/**
* | output |
* | --- |
* | "Reports" |
*
* @param {Admin_ReportsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports = /** @type {((inputs?: Admin_ReportsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_ReportsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_reports(inputs)
	if (locale === "en") return __en.admin_reports(inputs)
	return __ru.admin_reports(inputs)
});
/**
* | output |
* | --- |
* | "Immutable report snapshots. Publishing puts the file on the public contour." |
*
* @param {Admin_Reports_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports_hint = /** @type {((inputs?: Admin_Reports_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Reports_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_reports_hint(inputs)
	if (locale === "en") return __en.admin_reports_hint(inputs)
	return __ru.admin_reports_hint(inputs)
});
/**
* | output |
* | --- |
* | "Unpublished reports" |
*
* @param {Admin_Reports_UnpublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports_unpublished = /** @type {((inputs?: Admin_Reports_UnpublishedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Reports_UnpublishedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_reports_unpublished(inputs)
	if (locale === "en") return __en.admin_reports_unpublished(inputs)
	return __ru.admin_reports_unpublished(inputs)
});
/**
* | output |
* | --- |
* | "Roles and access" |
*
* @param {Admin_RolesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_roles = /** @type {((inputs?: Admin_RolesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_RolesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_roles(inputs)
	if (locale === "en") return __en.admin_roles(inputs)
	return __ru.admin_roles(inputs)
});
/**
* | output |
* | --- |
* | "Accounts and the roles and scopes granted to them." |
*
* @param {Admin_Roles_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_roles_hint = /** @type {((inputs?: Admin_Roles_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Roles_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_roles_hint(inputs)
	if (locale === "en") return __en.admin_roles_hint(inputs)
	return __ru.admin_roles_hint(inputs)
});
/**
* | output |
* | --- |
* | "Settings" |
*
* @param {Admin_SettingsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_settings = /** @type {((inputs?: Admin_SettingsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_SettingsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_settings(inputs)
	if (locale === "en") return __en.admin_settings(inputs)
	return __ru.admin_settings(inputs)
});
/**
* | output |
* | --- |
* | "Thresholds, semester boundaries and derivation rules. A change reaches the API immediately." |
*
* @param {Admin_Settings_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_settings_hint = /** @type {((inputs?: Admin_Settings_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Settings_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_settings_hint(inputs)
	if (locale === "en") return __en.admin_settings_hint(inputs)
	return __ru.admin_settings_hint(inputs)
});
/**
* | output |
* | --- |
* | "Data sources" |
*
* @param {Admin_SourcesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_sources = /** @type {((inputs?: Admin_SourcesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_SourcesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_sources(inputs)
	if (locale === "en") return __en.admin_sources(inputs)
	return __ru.admin_sources(inputs)
});
/**
* | output |
* | --- |
* | "Ingest sources and refresh schedules; manual import runs." |
*
* @param {Admin_Sources_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_sources_hint = /** @type {((inputs?: Admin_Sources_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Sources_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_sources_hint(inputs)
	if (locale === "en") return __en.admin_sources_hint(inputs)
	return __ru.admin_sources_hint(inputs)
});
/**
* | output |
* | --- |
* | "Administration" |
*
* @param {Admin_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_title = /** @type {((inputs?: Admin_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.admin_title(inputs)
	if (locale === "en") return __en.admin_title(inputs)
	return __ru.admin_title(inputs)
});
/**
* | output |
* | --- |
* | "Dictionary kind" |
*
* @param {Alias_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_kind = /** @type {((inputs?: Alias_KindInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_KindInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.alias_kind(inputs)
	if (locale === "en") return __en.alias_kind(inputs)
	return __ru.alias_kind(inputs)
});
/**
* | output |
* | --- |
* | "No aliases defined." |
*
* @param {Alias_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_none = /** @type {((inputs?: Alias_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.alias_none(inputs)
	if (locale === "en") return __en.alias_none(inputs)
	return __ru.alias_none(inputs)
});
/**
* | output |
* | --- |
* | "Label in the source" |
*
* @param {Alias_Source_LabelInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_source_label = /** @type {((inputs?: Alias_Source_LabelInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_Source_LabelInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.alias_source_label(inputs)
	if (locale === "en") return __en.alias_source_label(inputs)
	return __ru.alias_source_label(inputs)
});
/**
* | output |
* | --- |
* | "Dictionary entry" |
*
* @param {Alias_TargetInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_target = /** @type {((inputs?: Alias_TargetInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_TargetInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.alias_target(inputs)
	if (locale === "en") return __en.alias_target(inputs)
	return __ru.alias_target(inputs)
});
/**
* | output |
* | --- |
* | "Target code" |
*
* @param {Alias_Target_CodeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_target_code = /** @type {((inputs?: Alias_Target_CodeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_Target_CodeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.alias_target_code(inputs)
	if (locale === "en") return __en.alias_target_code(inputs)
	return __ru.alias_target_code(inputs)
});
/**
* | output |
* | --- |
* | "Maps the source system's labels onto the dashboard dictionaries." |
*
* @param {Aliases_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const aliases_hint = /** @type {((inputs?: Aliases_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aliases_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.aliases_hint(inputs)
	if (locale === "en") return __en.aliases_hint(inputs)
	return __ru.aliases_hint(inputs)
});
/**
* | output |
* | --- |
* | "Label aliases" |
*
* @param {Aliases_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const aliases_title = /** @type {((inputs?: Aliases_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aliases_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.aliases_title(inputs)
	if (locale === "en") return __en.aliases_title(inputs)
	return __ru.aliases_title(inputs)
});
/**
* | output |
* | --- |
* | "Try reloading the page. If the error persists, contact the system administrator." |
*
* @param {App_Error_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_body = /** @type {((inputs?: App_Error_BodyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Error_BodyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.app_error_body(inputs)
	if (locale === "en") return __en.app_error_body(inputs)
	return __ru.app_error_body(inputs)
});
/**
* | output |
* | --- |
* | "Go to the dashboard" |
*
* @param {App_Error_HomeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_home = /** @type {((inputs?: App_Error_HomeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Error_HomeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.app_error_home(inputs)
	if (locale === "en") return __en.app_error_home(inputs)
	return __ru.app_error_home(inputs)
});
/**
* | output |
* | --- |
* | "The page could not be loaded" |
*
* @param {App_Error_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_title = /** @type {((inputs?: App_Error_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Error_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.app_error_title(inputs)
	if (locale === "en") return __en.app_error_title(inputs)
	return __ru.app_error_title(inputs)
});
/**
* | output |
* | --- |
* | "Antiplagiarism Dashboard" |
*
* @param {App_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_title = /** @type {((inputs?: App_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.app_title(inputs)
	if (locale === "en") return __en.app_title(inputs)
	return __ru.app_title(inputs)
});
/**
* | output |
* | --- |
* | "Antiplagiarism Dashboard - Toraighyrov University" |
*
* @param {App_Title_FullInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_title_full = /** @type {((inputs?: App_Title_FullInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Title_FullInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.app_title_full(inputs)
	if (locale === "en") return __en.app_title_full(inputs)
	return __ru.app_title_full(inputs)
});
/**
* | output |
* | --- |
* | "Action" |
*
* @param {Audit_ActionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action = /** @type {((inputs?: Audit_ActionInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_ActionInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_action(inputs)
	if (locale === "en") return __en.audit_action(inputs)
	return __ru.audit_action(inputs)
});
/**
* | output |
* | --- |
* | "Admin change" |
*
* @param {Audit_Action_Admin_ChangeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_admin_change = /** @type {((inputs?: Audit_Action_Admin_ChangeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_Action_Admin_ChangeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_action_admin_change(inputs)
	if (locale === "en") return __en.audit_action_admin_change(inputs)
	return __ru.audit_action_admin_change(inputs)
});
/**
* | output |
* | --- |
* | "PDF export" |
*
* @param {Audit_Action_Export_PdfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_export_pdf = /** @type {((inputs?: Audit_Action_Export_PdfInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_Action_Export_PdfInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_action_export_pdf(inputs)
	if (locale === "en") return __en.audit_action_export_pdf(inputs)
	return __ru.audit_action_export_pdf(inputs)
});
/**
* | output |
* | --- |
* | "Excel export" |
*
* @param {Audit_Action_Export_XlsxInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_export_xlsx = /** @type {((inputs?: Audit_Action_Export_XlsxInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_Action_Export_XlsxInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_action_export_xlsx(inputs)
	if (locale === "en") return __en.audit_action_export_xlsx(inputs)
	return __ru.audit_action_export_xlsx(inputs)
});
/**
* | output |
* | --- |
* | "View" |
*
* @param {Audit_Action_ViewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_view = /** @type {((inputs?: Audit_Action_ViewInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_Action_ViewInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_action_view(inputs)
	if (locale === "en") return __en.audit_action_view(inputs)
	return __ru.audit_action_view(inputs)
});
/**
* | output |
* | --- |
* | "Any" |
*
* @param {Audit_AnyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_any = /** @type {((inputs?: Audit_AnyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_AnyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_any(inputs)
	if (locale === "en") return __en.audit_any(inputs)
	return __ru.audit_any(inputs)
});
/**
* | output |
* | --- |
* | "Filters" |
*
* @param {Audit_FiltersInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_filters = /** @type {((inputs?: Audit_FiltersInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_FiltersInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_filters(inputs)
	if (locale === "en") return __en.audit_filters(inputs)
	return __ru.audit_filters(inputs)
});
/**
* | output |
* | --- |
* | "{total} entries. Retention is at least {days} days; there is no deletion path." |
*
* @param {Audit_FooterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_footer = /** @type {((inputs: Audit_FooterInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_FooterInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_footer(inputs)
	if (locale === "en") return __en.audit_footer(inputs)
	return __ru.audit_footer(inputs)
});
/**
* | output |
* | --- |
* | "IP address" |
*
* @param {Audit_IpInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_ip = /** @type {((inputs?: Audit_IpInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_IpInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_ip(inputs)
	if (locale === "en") return __en.audit_ip(inputs)
	return __ru.audit_ip(inputs)
});
/**
* | output |
* | --- |
* | "No entries match these filters." |
*
* @param {Audit_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_none = /** @type {((inputs?: Audit_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_none(inputs)
	if (locale === "en") return __en.audit_none(inputs)
	return __ru.audit_none(inputs)
});
/**
* | output |
* | --- |
* | "Role" |
*
* @param {Audit_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_role = /** @type {((inputs?: Audit_RoleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_RoleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_role(inputs)
	if (locale === "en") return __en.audit_role(inputs)
	return __ru.audit_role(inputs)
});
/**
* | output |
* | --- |
* | "Section" |
*
* @param {Audit_SectionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_section = /** @type {((inputs?: Audit_SectionInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_SectionInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_section(inputs)
	if (locale === "en") return __en.audit_section(inputs)
	return __ru.audit_section(inputs)
});
/**
* | output |
* | --- |
* | "Time" |
*
* @param {Audit_TimeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_time = /** @type {((inputs?: Audit_TimeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_TimeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_time(inputs)
	if (locale === "en") return __en.audit_time(inputs)
	return __ru.audit_time(inputs)
});
/**
* | output |
* | --- |
* | "User" |
*
* @param {Audit_UserInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_user = /** @type {((inputs?: Audit_UserInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_UserInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.audit_user(inputs)
	if (locale === "en") return __en.audit_user(inputs)
	return __ru.audit_user(inputs)
});
/**
* | output |
* | --- |
* | "No rejected rows." |
*
* @param {Batch_Errors_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_empty = /** @type {((inputs?: Batch_Errors_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Errors_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_errors_empty(inputs)
	if (locale === "en") return __en.batch_errors_empty(inputs)
	return __ru.batch_errors_empty(inputs)
});
/**
* | output |
* | --- |
* | "Hide errors" |
*
* @param {Batch_Errors_HideInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_hide = /** @type {((inputs?: Batch_Errors_HideInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Errors_HideInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_errors_hide(inputs)
	if (locale === "en") return __en.batch_errors_hide(inputs)
	return __ru.batch_errors_hide(inputs)
});
/**
* | output |
* | --- |
* | "Errors" |
*
* @param {Batch_Errors_ShowInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_show = /** @type {((inputs?: Batch_Errors_ShowInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Errors_ShowInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_errors_show(inputs)
	if (locale === "en") return __en.batch_errors_show(inputs)
	return __ru.batch_errors_show(inputs)
});
/**
* | output |
* | --- |
* | "Rejected rows of batch #{id}" |
*
* @param {Batch_Errors_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_title = /** @type {((inputs: Batch_Errors_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Errors_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_errors_title(inputs)
	if (locale === "en") return __en.batch_errors_title(inputs)
	return __ru.batch_errors_title(inputs)
});
/**
* | output |
* | --- |
* | "Read" |
*
* @param {Batch_Rows_ReadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_read = /** @type {((inputs?: Batch_Rows_ReadInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Rows_ReadInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_rows_read(inputs)
	if (locale === "en") return __en.batch_rows_read(inputs)
	return __ru.batch_rows_read(inputs)
});
/**
* | output |
* | --- |
* | "Rejected" |
*
* @param {Batch_Rows_RejectedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_rejected = /** @type {((inputs?: Batch_Rows_RejectedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Rows_RejectedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_rows_rejected(inputs)
	if (locale === "en") return __en.batch_rows_rejected(inputs)
	return __ru.batch_rows_rejected(inputs)
});
/**
* | output |
* | --- |
* | "Skipped" |
*
* @param {Batch_Rows_SkippedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_skipped = /** @type {((inputs?: Batch_Rows_SkippedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Rows_SkippedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_rows_skipped(inputs)
	if (locale === "en") return __en.batch_rows_skipped(inputs)
	return __ru.batch_rows_skipped(inputs)
});
/**
* | output |
* | --- |
* | "Upserted" |
*
* @param {Batch_Rows_UpsertedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_upserted = /** @type {((inputs?: Batch_Rows_UpsertedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Rows_UpsertedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_rows_upserted(inputs)
	if (locale === "en") return __en.batch_rows_upserted(inputs)
	return __ru.batch_rows_upserted(inputs)
});
/**
* | output |
* | --- |
* | "Source" |
*
* @param {Batch_SourceInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_source = /** @type {((inputs?: Batch_SourceInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_SourceInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_source(inputs)
	if (locale === "en") return __en.batch_source(inputs)
	return __ru.batch_source(inputs)
});
/**
* | output |
* | --- |
* | "Started" |
*
* @param {Batch_StartedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_started = /** @type {((inputs?: Batch_StartedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_StartedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_started(inputs)
	if (locale === "en") return __en.batch_started(inputs)
	return __ru.batch_started(inputs)
});
/**
* | output |
* | --- |
* | "Status" |
*
* @param {Batch_StatusInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status = /** @type {((inputs?: Batch_StatusInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_StatusInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_status(inputs)
	if (locale === "en") return __en.batch_status(inputs)
	return __ru.batch_status(inputs)
});
/**
* | output |
* | --- |
* | "Failed" |
*
* @param {Batch_Status_FailedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_failed = /** @type {((inputs?: Batch_Status_FailedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Status_FailedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_status_failed(inputs)
	if (locale === "en") return __en.batch_status_failed(inputs)
	return __ru.batch_status_failed(inputs)
});
/**
* | output |
* | --- |
* | "Running" |
*
* @param {Batch_Status_RunningInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_running = /** @type {((inputs?: Batch_Status_RunningInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Status_RunningInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_status_running(inputs)
	if (locale === "en") return __en.batch_status_running(inputs)
	return __ru.batch_status_running(inputs)
});
/**
* | output |
* | --- |
* | "Succeeded" |
*
* @param {Batch_Status_SucceededInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_succeeded = /** @type {((inputs?: Batch_Status_SucceededInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Status_SucceededInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batch_status_succeeded(inputs)
	if (locale === "en") return __en.batch_status_succeeded(inputs)
	return __ru.batch_status_succeeded(inputs)
});
/**
* | output |
* | --- |
* | "No imports yet." |
*
* @param {Batches_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_empty = /** @type {((inputs?: Batches_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batches_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batches_empty(inputs)
	if (locale === "en") return __en.batches_empty(inputs)
	return __ru.batches_empty(inputs)
});
/**
* | output |
* | --- |
* | "Every run is journalled: time, source, row counts, validation errors." |
*
* @param {Batches_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_hint = /** @type {((inputs?: Batches_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batches_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batches_hint(inputs)
	if (locale === "en") return __en.batches_hint(inputs)
	return __ru.batches_hint(inputs)
});
/**
* | output |
* | --- |
* | "Import journal" |
*
* @param {Batches_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_title = /** @type {((inputs?: Batches_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batches_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.batches_title(inputs)
	if (locale === "en") return __en.batches_title(inputs)
	return __ru.batches_title(inputs)
});
/**
* | output |
* | --- |
* | "Toraighyrov University" |
*
* @param {Brand_LockupInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const brand_lockup = /** @type {((inputs?: Brand_LockupInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Brand_LockupInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.brand_lockup(inputs)
	if (locale === "en") return __en.brand_lockup(inputs)
	return __ru.brand_lockup(inputs)
});
/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Chart_Axis_Academic_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_academic_year = /** @type {((inputs?: Chart_Axis_Academic_YearInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_Academic_YearInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_academic_year(inputs)
	if (locale === "en") return __en.chart_axis_academic_year(inputs)
	return __ru.chart_axis_academic_year(inputs)
});
/**
* | output |
* | --- |
* | "Active reviewers" |
*
* @param {Chart_Axis_Active_ReviewersInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_active_reviewers = /** @type {((inputs?: Chart_Axis_Active_ReviewersInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_Active_ReviewersInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_active_reviewers(inputs)
	if (locale === "en") return __en.chart_axis_active_reviewers(inputs)
	return __ru.chart_axis_active_reviewers(inputs)
});
/**
* | output |
* | --- |
* | "Category" |
*
* @param {Chart_Axis_CategoryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_category = /** @type {((inputs?: Chart_Axis_CategoryInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_CategoryInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_category(inputs)
	if (locale === "en") return __en.chart_axis_category(inputs)
	return __ru.chart_axis_category(inputs)
});
/**
* | output |
* | --- |
* | "Number of checks" |
*
* @param {Chart_Axis_CountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_count = /** @type {((inputs?: Chart_Axis_CountInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_CountInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_count(inputs)
	if (locale === "en") return __en.chart_axis_count(inputs)
	return __ru.chart_axis_count(inputs)
});
/**
* | output |
* | --- |
* | "Faculty" |
*
* @param {Chart_Axis_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_faculty = /** @type {((inputs?: Chart_Axis_FacultyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_FacultyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_faculty(inputs)
	if (locale === "en") return __en.chart_axis_faculty(inputs)
	return __ru.chart_axis_faculty(inputs)
});
/**
* | output |
* | --- |
* | "Month" |
*
* @param {Chart_Axis_MonthInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_month = /** @type {((inputs?: Chart_Axis_MonthInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_MonthInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_month(inputs)
	if (locale === "en") return __en.chart_axis_month(inputs)
	return __ru.chart_axis_month(inputs)
});
/**
* | output |
* | --- |
* | "Originality, %" |
*
* @param {Chart_Axis_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_originality = /** @type {((inputs?: Chart_Axis_OriginalityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_OriginalityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_originality(inputs)
	if (locale === "en") return __en.chart_axis_originality(inputs)
	return __ru.chart_axis_originality(inputs)
});
/**
* | output |
* | --- |
* | "Share of total, %" |
*
* @param {Chart_Axis_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_share = /** @type {((inputs?: Chart_Axis_ShareInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_ShareInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_share(inputs)
	if (locale === "en") return __en.chart_axis_share(inputs)
	return __ru.chart_axis_share(inputs)
});
/**
* | output |
* | --- |
* | "Value" |
*
* @param {Chart_Axis_ValueInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_value = /** @type {((inputs?: Chart_Axis_ValueInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_ValueInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_value(inputs)
	if (locale === "en") return __en.chart_axis_value(inputs)
	return __ru.chart_axis_value(inputs)
});
/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Chart_Axis_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_work_type = /** @type {((inputs?: Chart_Axis_Work_TypeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_Work_TypeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_axis_work_type(inputs)
	if (locale === "en") return __en.chart_axis_work_type(inputs)
	return __ru.chart_axis_work_type(inputs)
});
/**
* | output |
* | --- |
* | "50–70%" |
*
* @param {Chart_Bucket_50_70Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_50_70 = /** @type {((inputs?: Chart_Bucket_50_70Inputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Bucket_50_70Inputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_bucket_50_70(inputs)
	if (locale === "en") return __en.chart_bucket_50_70(inputs)
	return __ru.chart_bucket_50_70(inputs)
});
/**
* | output |
* | --- |
* | "70–85%" |
*
* @param {Chart_Bucket_70_85Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_70_85 = /** @type {((inputs?: Chart_Bucket_70_85Inputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Bucket_70_85Inputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_bucket_70_85(inputs)
	if (locale === "en") return __en.chart_bucket_70_85(inputs)
	return __ru.chart_bucket_70_85(inputs)
});
/**
* | output |
* | --- |
* | "85–95%" |
*
* @param {Chart_Bucket_85_95Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_85_95 = /** @type {((inputs?: Chart_Bucket_85_95Inputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Bucket_85_95Inputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_bucket_85_95(inputs)
	if (locale === "en") return __en.chart_bucket_85_95(inputs)
	return __ru.chart_bucket_85_95(inputs)
});
/**
* | output |
* | --- |
* | "95% and above" |
*
* @param {Chart_Bucket_Gte_95Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_gte_95 = /** @type {((inputs?: Chart_Bucket_Gte_95Inputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Bucket_Gte_95Inputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_bucket_gte_95(inputs)
	if (locale === "en") return __en.chart_bucket_gte_95(inputs)
	return __ru.chart_bucket_gte_95(inputs)
});
/**
* | output |
* | --- |
* | "below 50%" |
*
* @param {Chart_Bucket_Lt_50Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_lt_50 = /** @type {((inputs?: Chart_Bucket_Lt_50Inputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Bucket_Lt_50Inputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_bucket_lt_50(inputs)
	if (locale === "en") return __en.chart_bucket_lt_50(inputs)
	return __ru.chart_bucket_lt_50(inputs)
});
/**
* | output |
* | --- |
* | "Data table" |
*
* @param {Chart_Data_TableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_data_table = /** @type {((inputs?: Chart_Data_TableInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Data_TableInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_data_table(inputs)
	if (locale === "en") return __en.chart_data_table(inputs)
	return __ru.chart_data_table(inputs)
});
/**
* | output |
* | --- |
* | "Escalations and rechecks by month" |
*
* @param {Chart_Dynamics_Flags_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_dynamics_flags_title = /** @type {((inputs?: Chart_Dynamics_Flags_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Dynamics_Flags_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_dynamics_flags_title(inputs)
	if (locale === "en") return __en.chart_dynamics_flags_title(inputs)
	return __ru.chart_dynamics_flags_title(inputs)
});
/**
* | output |
* | --- |
* | "Checks and average originality by month" |
*
* @param {Chart_Dynamics_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_dynamics_title = /** @type {((inputs?: Chart_Dynamics_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Dynamics_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_dynamics_title(inputs)
	if (locale === "en") return __en.chart_dynamics_title(inputs)
	return __ru.chart_dynamics_title(inputs)
});
/**
* | output |
* | --- |
* | "No data for the selected filters" |
*
* @param {Chart_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_empty = /** @type {((inputs?: Chart_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_empty(inputs)
	if (locale === "en") return __en.chart_empty(inputs)
	return __ru.chart_empty(inputs)
});
/**
* | output |
* | --- |
* | "Figures by faculty" |
*
* @param {Chart_Faculties_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_faculties_title = /** @type {((inputs?: Chart_Faculties_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Faculties_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_faculties_title(inputs)
	if (locale === "en") return __en.chart_faculties_title(inputs)
	return __ru.chart_faculties_title(inputs)
});
/**
* | output |
* | --- |
* | "Colour scale: from the lowest to the highest value in the column" |
*
* @param {Chart_Heatmap_ScaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_heatmap_scale = /** @type {((inputs?: Chart_Heatmap_ScaleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Heatmap_ScaleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_heatmap_scale(inputs)
	if (locale === "en") return __en.chart_heatmap_scale(inputs)
	return __ru.chart_heatmap_scale(inputs)
});
/**
* | output |
* | --- |
* | "Unit" |
*
* @param {Chart_Heatmap_UnitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_heatmap_unit = /** @type {((inputs?: Chart_Heatmap_UnitInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Heatmap_UnitInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_heatmap_unit(inputs)
	if (locale === "en") return __en.chart_heatmap_unit(inputs)
	return __ru.chart_heatmap_unit(inputs)
});
/**
* | output |
* | --- |
* | "Originality range" |
*
* @param {Chart_Histogram_BucketInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_histogram_bucket = /** @type {((inputs?: Chart_Histogram_BucketInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Histogram_BucketInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_histogram_bucket(inputs)
	if (locale === "en") return __en.chart_histogram_bucket(inputs)
	return __ru.chart_histogram_bucket(inputs)
});
/**
* | output |
* | --- |
* | "Checks by originality band" |
*
* @param {Chart_Histogram_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_histogram_title = /** @type {((inputs?: Chart_Histogram_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Histogram_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_histogram_title(inputs)
	if (locale === "en") return __en.chart_histogram_title(inputs)
	return __ru.chart_histogram_title(inputs)
});
/**
* | output |
* | --- |
* | "down by {delta}" |
*
* @param {Chart_Kpi_Delta_DownInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_down = /** @type {((inputs: Chart_Kpi_Delta_DownInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_Delta_DownInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_kpi_delta_down(inputs)
	if (locale === "en") return __en.chart_kpi_delta_down(inputs)
	return __ru.chart_kpi_delta_down(inputs)
});
/**
* | output |
* | --- |
* | "no change" |
*
* @param {Chart_Kpi_Delta_FlatInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_flat = /** @type {((inputs?: Chart_Kpi_Delta_FlatInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_Delta_FlatInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_kpi_delta_flat(inputs)
	if (locale === "en") return __en.chart_kpi_delta_flat(inputs)
	return __ru.chart_kpi_delta_flat(inputs)
});
/**
* | output |
* | --- |
* | "up by {delta}" |
*
* @param {Chart_Kpi_Delta_UpInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_up = /** @type {((inputs: Chart_Kpi_Delta_UpInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_Delta_UpInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_kpi_delta_up(inputs)
	if (locale === "en") return __en.chart_kpi_delta_up(inputs)
	return __ru.chart_kpi_delta_up(inputs)
});
/**
* | output |
* | --- |
* | "vs previous period" |
*
* @param {Chart_Kpi_PreviousInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_previous = /** @type {((inputs?: Chart_Kpi_PreviousInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_PreviousInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_kpi_previous(inputs)
	if (locale === "en") return __en.chart_kpi_previous(inputs)
	return __ru.chart_kpi_previous(inputs)
});
/**
* | output |
* | --- |
* | "Trend over the period" |
*
* @param {Chart_Kpi_SparklineInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_sparkline = /** @type {((inputs?: Chart_Kpi_SparklineInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_SparklineInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_kpi_sparkline(inputs)
	if (locale === "en") return __en.chart_kpi_sparkline(inputs)
	return __ru.chart_kpi_sparkline(inputs)
});
/**
* | output |
* | --- |
* | "Legend" |
*
* @param {Chart_LegendInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_legend = /** @type {((inputs?: Chart_LegendInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_LegendInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_legend(inputs)
	if (locale === "en") return __en.chart_legend(inputs)
	return __ru.chart_legend(inputs)
});
/**
* | output |
* | --- |
* | "Autumn semester {year}" |
*
* @param {Chart_Semester_AutumnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_autumn = /** @type {((inputs: Chart_Semester_AutumnInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Semester_AutumnInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_semester_autumn(inputs)
	if (locale === "en") return __en.chart_semester_autumn(inputs)
	return __ru.chart_semester_autumn(inputs)
});
/**
* | output |
* | --- |
* | "Semester boundaries" |
*
* @param {Chart_Semester_BandsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_bands = /** @type {((inputs?: Chart_Semester_BandsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Semester_BandsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_semester_bands(inputs)
	if (locale === "en") return __en.chart_semester_bands(inputs)
	return __ru.chart_semester_bands(inputs)
});
/**
* | output |
* | --- |
* | "Shading marks the autumn semester" |
*
* @param {Chart_Semester_ShadingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_shading = /** @type {((inputs?: Chart_Semester_ShadingInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Semester_ShadingInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_semester_shading(inputs)
	if (locale === "en") return __en.chart_semester_shading(inputs)
	return __ru.chart_semester_shading(inputs)
});
/**
* | output |
* | --- |
* | "Spring semester {year}" |
*
* @param {Chart_Semester_SpringInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_spring = /** @type {((inputs: Chart_Semester_SpringInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Semester_SpringInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_semester_spring(inputs)
	if (locale === "en") return __en.chart_semester_spring(inputs)
	return __ru.chart_semester_spring(inputs)
});
/**
* | output |
* | --- |
* | "Active reviewers" |
*
* @param {Chart_Series_Active_ReviewersInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_active_reviewers = /** @type {((inputs?: Chart_Series_Active_ReviewersInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Series_Active_ReviewersInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_series_active_reviewers(inputs)
	if (locale === "en") return __en.chart_series_active_reviewers(inputs)
	return __ru.chart_series_active_reviewers(inputs)
});
/**
* | output |
* | --- |
* | "Checks" |
*
* @param {Chart_Series_ChecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_checks = /** @type {((inputs?: Chart_Series_ChecksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Series_ChecksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_series_checks(inputs)
	if (locale === "en") return __en.chart_series_checks(inputs)
	return __ru.chart_series_checks(inputs)
});
/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Chart_Series_EscalatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_escalated = /** @type {((inputs?: Chart_Series_EscalatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Series_EscalatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_series_escalated(inputs)
	if (locale === "en") return __en.chart_series_escalated(inputs)
	return __ru.chart_series_escalated(inputs)
});
/**
* | output |
* | --- |
* | "Average originality" |
*
* @param {Chart_Series_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_originality = /** @type {((inputs?: Chart_Series_OriginalityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Series_OriginalityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_series_originality(inputs)
	if (locale === "en") return __en.chart_series_originality(inputs)
	return __ru.chart_series_originality(inputs)
});
/**
* | output |
* | --- |
* | "Rechecks" |
*
* @param {Chart_Series_RechecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_rechecks = /** @type {((inputs?: Chart_Series_RechecksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Series_RechecksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_series_rechecks(inputs)
	if (locale === "en") return __en.chart_series_rechecks(inputs)
	return __ru.chart_series_rechecks(inputs)
});
/**
* | output |
* | --- |
* | "{count} of {total} values are hidden: insufficient data" |
*
* @param {Chart_Suppressed_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_suppressed_note = /** @type {((inputs: Chart_Suppressed_NoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Suppressed_NoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_suppressed_note(inputs)
	if (locale === "en") return __en.chart_suppressed_note(inputs)
	return __ru.chart_suppressed_note(inputs)
});
/**
* | output |
* | --- |
* | "Metrics by faculty and department" |
*
* @param {Chart_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_units_title = /** @type {((inputs?: Chart_Units_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Units_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_units_title(inputs)
	if (locale === "en") return __en.chart_units_title(inputs)
	return __ru.chart_units_title(inputs)
});
/**
* | output |
* | --- |
* | "Active reviewers by month" |
*
* @param {Chart_Usage_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_usage_title = /** @type {((inputs?: Chart_Usage_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Usage_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_usage_title(inputs)
	if (locale === "en") return __en.chart_usage_title(inputs)
	return __ru.chart_usage_title(inputs)
});
/**
* | output |
* | --- |
* | "Checks by work type" |
*
* @param {Chart_Work_Types_CountsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_work_types_counts = /** @type {((inputs?: Chart_Work_Types_CountsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Work_Types_CountsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_work_types_counts(inputs)
	if (locale === "en") return __en.chart_work_types_counts(inputs)
	return __ru.chart_work_types_counts(inputs)
});
/**
* | output |
* | --- |
* | "Originality by work type" |
*
* @param {Chart_Work_Types_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_work_types_originality = /** @type {((inputs?: Chart_Work_Types_OriginalityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Work_Types_OriginalityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.chart_work_types_originality(inputs)
	if (locale === "en") return __en.chart_work_types_originality(inputs)
	return __ru.chart_work_types_originality(inputs)
});
/**
* | output |
* | --- |
* | "Delete this entry? This cannot be undone." |
*
* @param {Confirm_DeleteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_delete = /** @type {((inputs?: Confirm_DeleteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirm_DeleteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.confirm_delete(inputs)
	if (locale === "en") return __en.confirm_delete(inputs)
	return __ru.confirm_delete(inputs)
});
/**
* | output |
* | --- |
* | "Revoke this role from the account?" |
*
* @param {Confirm_Revoke_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_revoke_role = /** @type {((inputs?: Confirm_Revoke_RoleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirm_Revoke_RoleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.confirm_revoke_role(inputs)
	if (locale === "en") return __en.confirm_revoke_role(inputs)
	return __ru.confirm_revoke_role(inputs)
});
/**
* | output |
* | --- |
* | "Unpublish this report? It will no longer be available on the public dashboard." |
*
* @param {Confirm_Unpublish_ReportInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_unpublish_report = /** @type {((inputs?: Confirm_Unpublish_ReportInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirm_Unpublish_ReportInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.confirm_unpublish_report(inputs)
	if (locale === "en") return __en.confirm_unpublish_report(inputs)
	return __ru.confirm_unpublish_report(inputs)
});
/**
* | output |
* | --- |
* | "Active" |
*
* @param {Dict_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active = /** @type {((inputs?: Dict_ActiveInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_ActiveInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_active(inputs)
	if (locale === "en") return __en.dict_active(inputs)
	return __ru.dict_active(inputs)
});
/**
* | output |
* | --- |
* | "No" |
*
* @param {Dict_Active_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active_no = /** @type {((inputs?: Dict_Active_NoInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Active_NoInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_active_no(inputs)
	if (locale === "en") return __en.dict_active_no(inputs)
	return __ru.dict_active_no(inputs)
});
/**
* | output |
* | --- |
* | "Yes" |
*
* @param {Dict_Active_YesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active_yes = /** @type {((inputs?: Dict_Active_YesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Active_YesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_active_yes(inputs)
	if (locale === "en") return __en.dict_active_yes(inputs)
	return __ru.dict_active_yes(inputs)
});
/**
* | output |
* | --- |
* | "Code" |
*
* @param {Dict_CodeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_code = /** @type {((inputs?: Dict_CodeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_CodeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_code(inputs)
	if (locale === "en") return __en.dict_code(inputs)
	return __ru.dict_code(inputs)
});
/**
* | output |
* | --- |
* | "Unique code of the dictionary entry." |
*
* @param {Dict_Code_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_code_hint = /** @type {((inputs?: Dict_Code_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Code_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_code_hint(inputs)
	if (locale === "en") return __en.dict_code_hint(inputs)
	return __ru.dict_code_hint(inputs)
});
/**
* | output |
* | --- |
* | "Dictionary entries" |
*
* @param {Dict_EntriesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_entries = /** @type {((inputs?: Dict_EntriesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_EntriesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_entries(inputs)
	if (locale === "en") return __en.dict_entries(inputs)
	return __ru.dict_entries(inputs)
});
/**
* | output |
* | --- |
* | "Adding an existing code replaces the entry." |
*
* @param {Dict_Entries_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_entries_hint = /** @type {((inputs?: Dict_Entries_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Entries_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_entries_hint(inputs)
	if (locale === "en") return __en.dict_entries_hint(inputs)
	return __ru.dict_entries_hint(inputs)
});
/**
* | output |
* | --- |
* | "Name (EN)" |
*
* @param {Dict_Name_EnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_en = /** @type {((inputs?: Dict_Name_EnInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Name_EnInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_name_en(inputs)
	if (locale === "en") return __en.dict_name_en(inputs)
	return __ru.dict_name_en(inputs)
});
/**
* | output |
* | --- |
* | "Name (KK)" |
*
* @param {Dict_Name_KkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_kk = /** @type {((inputs?: Dict_Name_KkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Name_KkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_name_kk(inputs)
	if (locale === "en") return __en.dict_name_kk(inputs)
	return __ru.dict_name_kk(inputs)
});
/**
* | output |
* | --- |
* | "Name (RU)" |
*
* @param {Dict_Name_RuInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_ru = /** @type {((inputs?: Dict_Name_RuInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Name_RuInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_name_ru(inputs)
	if (locale === "en") return __en.dict_name_ru(inputs)
	return __ru.dict_name_ru(inputs)
});
/**
* | output |
* | --- |
* | "The dictionary is empty." |
*
* @param {Dict_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_none = /** @type {((inputs?: Dict_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_none(inputs)
	if (locale === "en") return __en.dict_none(inputs)
	return __ru.dict_none(inputs)
});
/**
* | output |
* | --- |
* | "Parent unit" |
*
* @param {Dict_ParentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_parent = /** @type {((inputs?: Dict_ParentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_ParentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_parent(inputs)
	if (locale === "en") return __en.dict_parent(inputs)
	return __ru.dict_parent(inputs)
});
/**
* | output |
* | --- |
* | "Not selected" |
*
* @param {Dict_Parent_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_parent_none = /** @type {((inputs?: Dict_Parent_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Parent_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_parent_none(inputs)
	if (locale === "en") return __en.dict_parent_none(inputs)
	return __ru.dict_parent_none(inputs)
});
/**
* | output |
* | --- |
* | "Sort order" |
*
* @param {Dict_Sort_OrderInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_sort_order = /** @type {((inputs?: Dict_Sort_OrderInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Sort_OrderInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_sort_order(inputs)
	if (locale === "en") return __en.dict_sort_order(inputs)
	return __ru.dict_sort_order(inputs)
});
/**
* | output |
* | --- |
* | "Departments" |
*
* @param {Dict_Tab_DepartmentsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_departments = /** @type {((inputs?: Dict_Tab_DepartmentsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Tab_DepartmentsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_tab_departments(inputs)
	if (locale === "en") return __en.dict_tab_departments(inputs)
	return __ru.dict_tab_departments(inputs)
});
/**
* | output |
* | --- |
* | "Faculties" |
*
* @param {Dict_Tab_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_faculties = /** @type {((inputs?: Dict_Tab_FacultiesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Tab_FacultiesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_tab_faculties(inputs)
	if (locale === "en") return __en.dict_tab_faculties(inputs)
	return __ru.dict_tab_faculties(inputs)
});
/**
* | output |
* | --- |
* | "Programmes" |
*
* @param {Dict_Tab_ProgramsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_programs = /** @type {((inputs?: Dict_Tab_ProgramsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Tab_ProgramsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_tab_programs(inputs)
	if (locale === "en") return __en.dict_tab_programs(inputs)
	return __ru.dict_tab_programs(inputs)
});
/**
* | output |
* | --- |
* | "Work types" |
*
* @param {Dict_Tab_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_work_types = /** @type {((inputs?: Dict_Tab_Work_TypesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Tab_Work_TypesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.dict_tab_work_types(inputs)
	if (locale === "en") return __en.dict_tab_work_types(inputs)
	return __ru.dict_tab_work_types(inputs)
});
/**
* | output |
* | --- |
* | "Academic integrity - widget" |
*
* @param {Embed_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const embed_title = /** @type {((inputs?: Embed_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Embed_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.embed_title(inputs)
	if (locale === "en") return __en.embed_title(inputs)
	return __ru.embed_title(inputs)
});
/**
* | output |
* | --- |
* | "The selected unit is outside your area of visibility. Change the filter or contact an administrator." |
*
* @param {Error_Out_Of_ScopeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_out_of_scope = /** @type {((inputs?: Error_Out_Of_ScopeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Out_Of_ScopeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.error_out_of_scope(inputs)
	if (locale === "en") return __en.error_out_of_scope(inputs)
	return __ru.error_out_of_scope(inputs)
});
/**
* | output |
* | --- |
* | "Your role does not grant access to this section. Contact the system administrator." |
*
* @param {Error_Role_DeniedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_role_denied = /** @type {((inputs?: Error_Role_DeniedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Role_DeniedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.error_role_denied(inputs)
	if (locale === "en") return __en.error_role_denied(inputs)
	return __ru.error_role_denied(inputs)
});
/**
* | output |
* | --- |
* | "The session has ended. Sign in again." |
*
* @param {Error_Session_ExpiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_session_expired = /** @type {((inputs?: Error_Session_ExpiredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Session_ExpiredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.error_session_expired(inputs)
	if (locale === "en") return __en.error_session_expired(inputs)
	return __ru.error_session_expired(inputs)
});
/**
* | output |
* | --- |
* | "The per-unit breakdown is always k-screened, whatever the role." |
*
* @param {Escalations_Units_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const escalations_units_note = /** @type {((inputs?: Escalations_Units_NoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Escalations_Units_NoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.escalations_units_note(inputs)
	if (locale === "en") return __en.escalations_units_note(inputs)
	return __ru.escalations_units_note(inputs)
});
/**
* | output |
* | --- |
* | "Escalations by unit" |
*
* @param {Escalations_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const escalations_units_title = /** @type {((inputs?: Escalations_Units_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Escalations_Units_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.escalations_units_title(inputs)
	if (locale === "en") return __en.escalations_units_title(inputs)
	return __ru.escalations_units_title(inputs)
});
/**
* | output |
* | --- |
* | "The Ethics Council register is empty for this period." |
*
* @param {Ethics_Cases_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_cases_empty = /** @type {((inputs?: Ethics_Cases_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_Cases_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.ethics_cases_empty(inputs)
	if (locale === "en") return __en.ethics_cases_empty(inputs)
	return __ru.ethics_cases_empty(inputs)
});
/**
* | output |
* | --- |
* | "Ethics Council register" |
*
* @param {Ethics_Cases_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_cases_title = /** @type {((inputs?: Ethics_Cases_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_Cases_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.ethics_cases_title(inputs)
	if (locale === "en") return __en.ethics_cases_title(inputs)
	return __ru.ethics_cases_title(inputs)
});
/**
* | output |
* | --- |
* | "Violation category" |
*
* @param {Ethics_CategoryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_category = /** @type {((inputs?: Ethics_CategoryInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_CategoryInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.ethics_category(inputs)
	if (locale === "en") return __en.ethics_category(inputs)
	return __ru.ethics_category(inputs)
});
/**
* | output |
* | --- |
* | "Closed" |
*
* @param {Ethics_ClosedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_closed = /** @type {((inputs?: Ethics_ClosedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_ClosedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.ethics_closed(inputs)
	if (locale === "en") return __en.ethics_closed(inputs)
	return __ru.ethics_closed(inputs)
});
/**
* | output |
* | --- |
* | "Referred" |
*
* @param {Ethics_ReferredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_referred = /** @type {((inputs?: Ethics_ReferredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_ReferredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.ethics_referred(inputs)
	if (locale === "en") return __en.ethics_referred(inputs)
	return __ru.ethics_referred(inputs)
});
/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Ethics_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_year = /** @type {((inputs?: Ethics_YearInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_YearInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.ethics_year(inputs)
	if (locale === "en") return __en.ethics_year(inputs)
	return __ru.ethics_year(inputs)
});
/**
* | output |
* | --- |
* | "Preparing…" |
*
* @param {Export_BusyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_busy = /** @type {((inputs?: Export_BusyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_BusyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.export_busy(inputs)
	if (locale === "en") return __en.export_busy(inputs)
	return __ru.export_busy(inputs)
});
/**
* | output |
* | --- |
* | "The file could not be generated." |
*
* @param {Export_ErrorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_error = /** @type {((inputs?: Export_ErrorInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_ErrorInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.export_error(inputs)
	if (locale === "en") return __en.export_error(inputs)
	return __ru.export_error(inputs)
});
/**
* | output |
* | --- |
* | "For official use only. The export is journalled." |
*
* @param {Export_Official_UseInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_official_use = /** @type {((inputs?: Export_Official_UseInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_Official_UseInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.export_official_use(inputs)
	if (locale === "en") return __en.export_official_use(inputs)
	return __ru.export_official_use(inputs)
});
/**
* | output |
* | --- |
* | "Export PDF" |
*
* @param {Export_PdfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_pdf = /** @type {((inputs?: Export_PdfInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_PdfInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.export_pdf(inputs)
	if (locale === "en") return __en.export_pdf(inputs)
	return __ru.export_pdf(inputs)
});
/**
* | output |
* | --- |
* | "The file contains the figures for the selected period with the current filters applied." |
*
* @param {Export_Public_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_public_hint = /** @type {((inputs?: Export_Public_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_Public_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.export_public_hint(inputs)
	if (locale === "en") return __en.export_public_hint(inputs)
	return __ru.export_public_hint(inputs)
});
/**
* | output |
* | --- |
* | "Data export" |
*
* @param {Export_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_title = /** @type {((inputs?: Export_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.export_title(inputs)
	if (locale === "en") return __en.export_title(inputs)
	return __ru.export_title(inputs)
});
/**
* | output |
* | --- |
* | "Export Excel" |
*
* @param {Export_XlsxInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_xlsx = /** @type {((inputs?: Export_XlsxInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_XlsxInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.export_xlsx(inputs)
	if (locale === "en") return __en.export_xlsx(inputs)
	return __ru.export_xlsx(inputs)
});
/**
* | output |
* | --- |
* | "All departments" |
*
* @param {Filter_All_DepartmentsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_departments = /** @type {((inputs?: Filter_All_DepartmentsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_All_DepartmentsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_all_departments(inputs)
	if (locale === "en") return __en.filter_all_departments(inputs)
	return __ru.filter_all_departments(inputs)
});
/**
* | output |
* | --- |
* | "All faculties" |
*
* @param {Filter_All_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_faculties = /** @type {((inputs?: Filter_All_FacultiesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_All_FacultiesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_all_faculties(inputs)
	if (locale === "en") return __en.filter_all_faculties(inputs)
	return __ru.filter_all_faculties(inputs)
});
/**
* | output |
* | --- |
* | "All statuses" |
*
* @param {Filter_All_StatusesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_statuses = /** @type {((inputs?: Filter_All_StatusesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_All_StatusesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_all_statuses(inputs)
	if (locale === "en") return __en.filter_all_statuses(inputs)
	return __ru.filter_all_statuses(inputs)
});
/**
* | output |
* | --- |
* | "All work types" |
*
* @param {Filter_All_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_work_types = /** @type {((inputs?: Filter_All_Work_TypesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_All_Work_TypesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_all_work_types(inputs)
	if (locale === "en") return __en.filter_all_work_types(inputs)
	return __ru.filter_all_work_types(inputs)
});
/**
* | output |
* | --- |
* | "Filters" |
*
* @param {Filter_Bar_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_bar_title = /** @type {((inputs?: Filter_Bar_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Bar_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_bar_title(inputs)
	if (locale === "en") return __en.filter_bar_title(inputs)
	return __ru.filter_bar_title(inputs)
});
/**
* | output |
* | --- |
* | "Department" |
*
* @param {Filter_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_department = /** @type {((inputs?: Filter_DepartmentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_DepartmentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_department(inputs)
	if (locale === "en") return __en.filter_department(inputs)
	return __ru.filter_department(inputs)
});
/**
* | output |
* | --- |
* | "Faculty" |
*
* @param {Filter_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_faculty = /** @type {((inputs?: Filter_FacultyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_FacultyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_faculty(inputs)
	if (locale === "en") return __en.filter_faculty(inputs)
	return __ru.filter_faculty(inputs)
});
/**
* | output |
* | --- |
* | "Start date" |
*
* @param {Filter_FromInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_from = /** @type {((inputs?: Filter_FromInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_FromInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_from(inputs)
	if (locale === "en") return __en.filter_from(inputs)
	return __ru.filter_from(inputs)
});
/**
* | output |
* | --- |
* | "Period" |
*
* @param {Filter_PeriodInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period = /** @type {((inputs?: Filter_PeriodInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_PeriodInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_period(inputs)
	if (locale === "en") return __en.filter_period(inputs)
	return __ru.filter_period(inputs)
});
/**
* | output |
* | --- |
* | "3 years" |
*
* @param {Filter_Period_3yInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_3y = /** @type {((inputs?: Filter_Period_3yInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_3yInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_period_3y(inputs)
	if (locale === "en") return __en.filter_period_3y(inputs)
	return __ru.filter_period_3y(inputs)
});
/**
* | output |
* | --- |
* | "5 years" |
*
* @param {Filter_Period_5yInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_5y = /** @type {((inputs?: Filter_Period_5yInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_5yInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_period_5y(inputs)
	if (locale === "en") return __en.filter_period_5y(inputs)
	return __ru.filter_period_5y(inputs)
});
/**
* | output |
* | --- |
* | "Custom" |
*
* @param {Filter_Period_CustomInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_custom = /** @type {((inputs?: Filter_Period_CustomInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_CustomInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_period_custom(inputs)
	if (locale === "en") return __en.filter_period_custom(inputs)
	return __ru.filter_period_custom(inputs)
});
/**
* | output |
* | --- |
* | "Month" |
*
* @param {Filter_Period_MonthInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_month = /** @type {((inputs?: Filter_Period_MonthInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_MonthInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_period_month(inputs)
	if (locale === "en") return __en.filter_period_month(inputs)
	return __ru.filter_period_month(inputs)
});
/**
* | output |
* | --- |
* | "Semester" |
*
* @param {Filter_Period_SemesterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_semester = /** @type {((inputs?: Filter_Period_SemesterInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_SemesterInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_period_semester(inputs)
	if (locale === "en") return __en.filter_period_semester(inputs)
	return __ru.filter_period_semester(inputs)
});
/**
* | output |
* | --- |
* | "Showing {from} - {to}" |
*
* @param {Filter_Period_ShownInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_shown = /** @type {((inputs: Filter_Period_ShownInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_ShownInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_period_shown(inputs)
	if (locale === "en") return __en.filter_period_shown(inputs)
	return __ru.filter_period_shown(inputs)
});
/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Filter_Period_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_year = /** @type {((inputs?: Filter_Period_YearInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_YearInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_period_year(inputs)
	if (locale === "en") return __en.filter_period_year(inputs)
	return __ru.filter_period_year(inputs)
});
/**
* | output |
* | --- |
* | "Study program" |
*
* @param {Filter_ProgramInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program = /** @type {((inputs?: Filter_ProgramInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_ProgramInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_program(inputs)
	if (locale === "en") return __en.filter_program(inputs)
	return __ru.filter_program(inputs)
});
/**
* | output |
* | --- |
* | "Enter the study-programme code - picking from a list is not available yet." |
*
* @param {Filter_Program_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program_hint = /** @type {((inputs?: Filter_Program_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Program_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_program_hint(inputs)
	if (locale === "en") return __en.filter_program_hint(inputs)
	return __ru.filter_program_hint(inputs)
});
/**
* | output |
* | --- |
* | "PROG01" |
*
* @param {Filter_Program_PlaceholderInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program_placeholder = /** @type {((inputs?: Filter_Program_PlaceholderInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Program_PlaceholderInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_program_placeholder(inputs)
	if (locale === "en") return __en.filter_program_placeholder(inputs)
	return __ru.filter_program_placeholder(inputs)
});
/**
* | output |
* | --- |
* | "Reset filters" |
*
* @param {Filter_ResetInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_reset = /** @type {((inputs?: Filter_ResetInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_ResetInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_reset(inputs)
	if (locale === "en") return __en.filter_reset(inputs)
	return __ru.filter_reset(inputs)
});
/**
* | output |
* | --- |
* | "Check status" |
*
* @param {Filter_StatusInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_status = /** @type {((inputs?: Filter_StatusInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_StatusInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_status(inputs)
	if (locale === "en") return __en.filter_status(inputs)
	return __ru.filter_status(inputs)
});
/**
* | output |
* | --- |
* | "End date" |
*
* @param {Filter_ToInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_to = /** @type {((inputs?: Filter_ToInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_ToInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_to(inputs)
	if (locale === "en") return __en.filter_to(inputs)
	return __ru.filter_to(inputs)
});
/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Filter_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_work_type = /** @type {((inputs?: Filter_Work_TypeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Work_TypeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.filter_work_type(inputs)
	if (locale === "en") return __en.filter_work_type(inputs)
	return __ru.filter_work_type(inputs)
});
/**
* | output |
* | --- |
* | "This dashboard publishes anonymized statistics on originality checks of written work at Toraighyrov University. Figures are aggregated - by university, facul..." |
*
* @param {Footer_About_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_about_body = /** @type {((inputs?: Footer_About_BodyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_About_BodyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.footer_about_body(inputs)
	if (locale === "en") return __en.footer_about_body(inputs)
	return __ru.footer_about_body(inputs)
});
/**
* | output |
* | --- |
* | "About this dashboard" |
*
* @param {Footer_About_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_about_title = /** @type {((inputs?: Footer_About_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_About_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.footer_about_title(inputs)
	if (locale === "en") return __en.footer_about_title(inputs)
	return __ru.footer_about_title(inputs)
});
/**
* | output |
* | --- |
* | "Sections" |
*
* @param {Footer_Sections_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_sections_title = /** @type {((inputs?: Footer_Sections_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_Sections_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.footer_sections_title(inputs)
	if (locale === "en") return __en.footer_sections_title(inputs)
	return __ru.footer_sections_title(inputs)
});
/**
* | output |
* | --- |
* | "Staff sign-in" |
*
* @param {Footer_Staff_LinkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_staff_link = /** @type {((inputs?: Footer_Staff_LinkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_Staff_LinkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.footer_staff_link(inputs)
	if (locale === "en") return __en.footer_staff_link(inputs)
	return __ru.footer_staff_link(inputs)
});
/**
* | output |
* | --- |
* | "The data is refreshed at least once a day." |
*
* @param {Footer_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_updated = /** @type {((inputs?: Footer_UpdatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_UpdatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.footer_updated(inputs)
	if (locale === "en") return __en.footer_updated(inputs)
	return __ru.footer_updated(inputs)
});
/**
* | output |
* | --- |
* | "Could not save" |
*
* @param {Form_ErrorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_error = /** @type {((inputs?: Form_ErrorInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_ErrorInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.form_error(inputs)
	if (locale === "en") return __en.form_error(inputs)
	return __ru.form_error(inputs)
});
/**
* | output |
* | --- |
* | "Enter a valid e-mail address" |
*
* @param {Form_Invalid_EmailInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_email = /** @type {((inputs?: Form_Invalid_EmailInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_Invalid_EmailInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.form_invalid_email(inputs)
	if (locale === "en") return __en.form_invalid_email(inputs)
	return __ru.form_invalid_email(inputs)
});
/**
* | output |
* | --- |
* | "Malformed JSON, or the structure does not match" |
*
* @param {Form_Invalid_JsonInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_json = /** @type {((inputs?: Form_Invalid_JsonInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_Invalid_JsonInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.form_invalid_json(inputs)
	if (locale === "en") return __en.form_invalid_json(inputs)
	return __ru.form_invalid_json(inputs)
});
/**
* | output |
* | --- |
* | "Enter a non-negative whole number" |
*
* @param {Form_Invalid_NumberInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_number = /** @type {((inputs?: Form_Invalid_NumberInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_Invalid_NumberInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.form_invalid_number(inputs)
	if (locale === "en") return __en.form_invalid_number(inputs)
	return __ru.form_invalid_number(inputs)
});
/**
* | output |
* | --- |
* | "Required" |
*
* @param {Form_RequiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_required = /** @type {((inputs?: Form_RequiredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_RequiredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.form_required(inputs)
	if (locale === "en") return __en.form_required(inputs)
	return __ru.form_required(inputs)
});
/**
* | output |
* | --- |
* | "Saved" |
*
* @param {Form_SavedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_saved = /** @type {((inputs?: Form_SavedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_SavedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.form_saved(inputs)
	if (locale === "en") return __en.form_saved(inputs)
	return __ru.form_saved(inputs)
});
/**
* | output |
* | --- |
* | "Saving…" |
*
* @param {Form_SavingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_saving = /** @type {((inputs?: Form_SavingInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_SavingInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.form_saving(inputs)
	if (locale === "en") return __en.form_saving(inputs)
	return __ru.form_saving(inputs)
});
/**
* | output |
* | --- |
* | "Interface language" |
*
* @param {Header_Locale_LabelInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const header_locale_label = /** @type {((inputs?: Header_Locale_LabelInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Header_Locale_LabelInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.header_locale_label(inputs)
	if (locale === "en") return __en.header_locale_label(inputs)
	return __ru.header_locale_label(inputs)
});
/**
* | output |
* | --- |
* | "Skip to content" |
*
* @param {Header_Skip_LinkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const header_skip_link = /** @type {((inputs?: Header_Skip_LinkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Header_Skip_LinkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.header_skip_link(inputs)
	if (locale === "en") return __en.header_skip_link(inputs)
	return __ru.header_skip_link(inputs)
});
/**
* | output |
* | --- |
* | "Other" |
*
* @param {Initiator_OtherInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_other = /** @type {((inputs?: Initiator_OtherInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_OtherInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.initiator_other(inputs)
	if (locale === "en") return __en.initiator_other(inputs)
	return __ru.initiator_other(inputs)
});
/**
* | output |
* | --- |
* | "Registrar's office" |
*
* @param {Initiator_RegistrarInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_registrar = /** @type {((inputs?: Initiator_RegistrarInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_RegistrarInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.initiator_registrar(inputs)
	if (locale === "en") return __en.initiator_registrar(inputs)
	return __ru.initiator_registrar(inputs)
});
/**
* | output |
* | --- |
* | "Derive the initiator role from the reviewer's address." |
*
* @param {Initiator_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_rules_hint = /** @type {((inputs?: Initiator_Rules_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_Rules_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.initiator_rules_hint(inputs)
	if (locale === "en") return __en.initiator_rules_hint(inputs)
	return __ru.initiator_rules_hint(inputs)
});
/**
* | output |
* | --- |
* | "Initiator rules" |
*
* @param {Initiator_Rules_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_rules_title = /** @type {((inputs?: Initiator_Rules_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_Rules_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.initiator_rules_title(inputs)
	if (locale === "en") return __en.initiator_rules_title(inputs)
	return __ru.initiator_rules_title(inputs)
});
/**
* | output |
* | --- |
* | "Teaching staff (self-check)" |
*
* @param {Initiator_Staff_SelfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_staff_self = /** @type {((inputs?: Initiator_Staff_SelfInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_Staff_SelfInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.initiator_staff_self(inputs)
	if (locale === "en") return __en.initiator_staff_self(inputs)
	return __ru.initiator_staff_self(inputs)
});
/**
* | output |
* | --- |
* | "Student" |
*
* @param {Initiator_StudentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_student = /** @type {((inputs?: Initiator_StudentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_StudentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.initiator_student(inputs)
	if (locale === "en") return __en.initiator_student(inputs)
	return __ru.initiator_student(inputs)
});
/**
* | output |
* | --- |
* | "insufficient data" |
*
* @param {Insufficient_DataInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const insufficient_data = /** @type {((inputs?: Insufficient_DataInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insufficient_DataInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.insufficient_data(inputs)
	if (locale === "en") return __en.insufficient_data(inputs)
	return __ru.insufficient_data(inputs)
});
/**
* | output |
* | --- |
* | "Internal Antiplagiarism Analytics" |
*
* @param {Internal_Contour_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_contour_title = /** @type {((inputs?: Internal_Contour_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Contour_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.internal_contour_title(inputs)
	if (locale === "en") return __en.internal_contour_title(inputs)
	return __ru.internal_contour_title(inputs)
});
/**
* | output |
* | --- |
* | "Other" |
*
* @param {Internal_Nav_OtherInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_other = /** @type {((inputs?: Internal_Nav_OtherInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Nav_OtherInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.internal_nav_other(inputs)
	if (locale === "en") return __en.internal_nav_other(inputs)
	return __ru.internal_nav_other(inputs)
});
/**
* | output |
* | --- |
* | "Public contour" |
*
* @param {Internal_Nav_PublicInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_public = /** @type {((inputs?: Internal_Nav_PublicInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Nav_PublicInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.internal_nav_public(inputs)
	if (locale === "en") return __en.internal_nav_public(inputs)
	return __ru.internal_nav_public(inputs)
});
/**
* | output |
* | --- |
* | "Sections" |
*
* @param {Internal_Nav_SectionsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_sections = /** @type {((inputs?: Internal_Nav_SectionsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Nav_SectionsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.internal_nav_sections(inputs)
	if (locale === "en") return __en.internal_nav_sections(inputs)
	return __ru.internal_nav_sections(inputs)
});
/**
* | output |
* | --- |
* | "Show or hide the menu" |
*
* @param {Internal_Nav_ToggleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_toggle = /** @type {((inputs?: Internal_Nav_ToggleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Nav_ToggleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.internal_nav_toggle(inputs)
	if (locale === "en") return __en.internal_nav_toggle(inputs)
	return __ru.internal_nav_toggle(inputs)
});
/**
* | output |
* | --- |
* | "Metrics within your area of visibility." |
*
* @param {Internal_Overview_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_overview_hint = /** @type {((inputs?: Internal_Overview_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Overview_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.internal_overview_hint(inputs)
	if (locale === "en") return __en.internal_overview_hint(inputs)
	return __ru.internal_overview_hint(inputs)
});
/**
* | output |
* | --- |
* | "Groups smaller than {k} checks are not published - the value is replaced by «insufficient data»." |
*
* @param {K_Threshold_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const k_threshold_note = /** @type {((inputs: K_Threshold_NoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<K_Threshold_NoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.k_threshold_note(inputs)
	if (locale === "en") return __en.k_threshold_note(inputs)
	return __ru.k_threshold_note(inputs)
});
/**
* | output |
* | --- |
* | "Average originality" |
*
* @param {Kpi_Avg_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_avg_originality = /** @type {((inputs?: Kpi_Avg_OriginalityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Avg_OriginalityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_avg_originality(inputs)
	if (locale === "en") return __en.kpi_avg_originality(inputs)
	return __ru.kpi_avg_originality(inputs)
});
/**
* | output |
* | --- |
* | "Mean across every check in the period" |
*
* @param {Kpi_Avg_Originality_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_avg_originality_hint = /** @type {((inputs?: Kpi_Avg_Originality_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Avg_Originality_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_avg_originality_hint(inputs)
	if (locale === "en") return __en.kpi_avg_originality_hint(inputs)
	return __ru.kpi_avg_originality_hint(inputs)
});
/**
* | output |
* | --- |
* | "Share below the threshold" |
*
* @param {Kpi_Below_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_below_threshold = /** @type {((inputs?: Kpi_Below_ThresholdInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Below_ThresholdInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_below_threshold(inputs)
	if (locale === "en") return __en.kpi_below_threshold(inputs)
	return __ru.kpi_below_threshold(inputs)
});
/**
* | output |
* | --- |
* | "Checks below the threshold: {count}" |
*
* @param {Kpi_Below_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_below_threshold_hint = /** @type {((inputs: Kpi_Below_Threshold_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Below_Threshold_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_below_threshold_hint(inputs)
	if (locale === "en") return __en.kpi_below_threshold_hint(inputs)
	return __ru.kpi_below_threshold_hint(inputs)
});
/**
* | output |
* | --- |
* | "Check coverage" |
*
* @param {Kpi_CoverageInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_coverage = /** @type {((inputs?: Kpi_CoverageInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_CoverageInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_coverage(inputs)
	if (locale === "en") return __en.kpi_coverage(inputs)
	return __ru.kpi_coverage(inputs)
});
/**
* | output |
* | --- |
* | "Share of submitted works that were checked" |
*
* @param {Kpi_Coverage_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_coverage_hint = /** @type {((inputs?: Kpi_Coverage_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Coverage_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_coverage_hint(inputs)
	if (locale === "en") return __en.kpi_coverage_hint(inputs)
	return __ru.kpi_coverage_hint(inputs)
});
/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Kpi_EscalatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated = /** @type {((inputs?: Kpi_EscalatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_EscalatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_escalated(inputs)
	if (locale === "en") return __en.kpi_escalated(inputs)
	return __ru.kpi_escalated(inputs)
});
/**
* | output |
* | --- |
* | "Suspicious works whose flag has not been cleared" |
*
* @param {Kpi_Escalated_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_hint = /** @type {((inputs?: Kpi_Escalated_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Escalated_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_escalated_hint(inputs)
	if (locale === "en") return __en.kpi_escalated_hint(inputs)
	return __ru.kpi_escalated_hint(inputs)
});
/**
* | output |
* | --- |
* | "Escalation share" |
*
* @param {Kpi_Escalated_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_share = /** @type {((inputs?: Kpi_Escalated_ShareInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Escalated_ShareInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_escalated_share(inputs)
	if (locale === "en") return __en.kpi_escalated_share(inputs)
	return __ru.kpi_escalated_share(inputs)
});
/**
* | output |
* | --- |
* | "Of the period's checks" |
*
* @param {Kpi_Escalated_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_share_hint = /** @type {((inputs?: Kpi_Escalated_Share_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Escalated_Share_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_escalated_share_hint(inputs)
	if (locale === "en") return __en.kpi_escalated_share_hint(inputs)
	return __ru.kpi_escalated_share_hint(inputs)
});
/**
* | output |
* | --- |
* | "Improved" |
*
* @param {Kpi_ImprovedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved = /** @type {((inputs?: Kpi_ImprovedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_ImprovedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_improved(inputs)
	if (locale === "en") return __en.kpi_improved(inputs)
	return __ru.kpi_improved(inputs)
});
/**
* | output |
* | --- |
* | "Improved share" |
*
* @param {Kpi_Improved_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved_share = /** @type {((inputs?: Kpi_Improved_ShareInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Improved_ShareInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_improved_share(inputs)
	if (locale === "en") return __en.kpi_improved_share(inputs)
	return __ru.kpi_improved_share(inputs)
});
/**
* | output |
* | --- |
* | "Works improved: {count}" |
*
* @param {Kpi_Improved_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved_share_hint = /** @type {((inputs: Kpi_Improved_Share_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Improved_Share_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_improved_share_hint(inputs)
	if (locale === "en") return __en.kpi_improved_share_hint(inputs)
	return __ru.kpi_improved_share_hint(inputs)
});
/**
* | output |
* | --- |
* | "Recheck share" |
*
* @param {Kpi_Recheck_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_recheck_share = /** @type {((inputs?: Kpi_Recheck_ShareInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Recheck_ShareInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_recheck_share(inputs)
	if (locale === "en") return __en.kpi_recheck_share(inputs)
	return __ru.kpi_recheck_share(inputs)
});
/**
* | output |
* | --- |
* | "Of all works" |
*
* @param {Kpi_Recheck_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_recheck_share_hint = /** @type {((inputs?: Kpi_Recheck_Share_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Recheck_Share_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_recheck_share_hint(inputs)
	if (locale === "en") return __en.kpi_recheck_share_hint(inputs)
	return __ru.kpi_recheck_share_hint(inputs)
});
/**
* | output |
* | --- |
* | "Total checks" |
*
* @param {Kpi_Total_ChecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_total_checks = /** @type {((inputs?: Kpi_Total_ChecksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Total_ChecksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_total_checks(inputs)
	if (locale === "en") return __en.kpi_total_checks(inputs)
	return __ru.kpi_total_checks(inputs)
});
/**
* | output |
* | --- |
* | "For the selected period" |
*
* @param {Kpi_Total_Checks_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_total_checks_hint = /** @type {((inputs?: Kpi_Total_Checks_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Total_Checks_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_total_checks_hint(inputs)
	if (locale === "en") return __en.kpi_total_checks_hint(inputs)
	return __ru.kpi_total_checks_hint(inputs)
});
/**
* | output |
* | --- |
* | "Rechecked" |
*
* @param {Kpi_Works_RecheckedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_rechecked = /** @type {((inputs?: Kpi_Works_RecheckedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Works_RecheckedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_works_rechecked(inputs)
	if (locale === "en") return __en.kpi_works_rechecked(inputs)
	return __ru.kpi_works_rechecked(inputs)
});
/**
* | output |
* | --- |
* | "Works with more than one attempt" |
*
* @param {Kpi_Works_Rechecked_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_rechecked_hint = /** @type {((inputs?: Kpi_Works_Rechecked_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Works_Rechecked_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_works_rechecked_hint(inputs)
	if (locale === "en") return __en.kpi_works_rechecked_hint(inputs)
	return __ru.kpi_works_rechecked_hint(inputs)
});
/**
* | output |
* | --- |
* | "Works in total" |
*
* @param {Kpi_Works_TotalInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_total = /** @type {((inputs?: Kpi_Works_TotalInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Works_TotalInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_works_total(inputs)
	if (locale === "en") return __en.kpi_works_total(inputs)
	return __ru.kpi_works_total(inputs)
});
/**
* | output |
* | --- |
* | "Distinct works in the period" |
*
* @param {Kpi_Works_Total_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_total_hint = /** @type {((inputs?: Kpi_Works_Total_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Works_Total_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.kpi_works_total_hint(inputs)
	if (locale === "en") return __en.kpi_works_total_hint(inputs)
	return __ru.kpi_works_total_hint(inputs)
});
/**
* | output |
* | --- |
* | "English" |
*
* @param {Locale_Name_EnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_en = /** @type {((inputs?: Locale_Name_EnInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Locale_Name_EnInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.locale_name_en(inputs)
	if (locale === "en") return __en.locale_name_en(inputs)
	return __ru.locale_name_en(inputs)
});
/**
* | output |
* | --- |
* | "Қазақша" |
*
* @param {Locale_Name_KkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_kk = /** @type {((inputs?: Locale_Name_KkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Locale_Name_KkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.locale_name_kk(inputs)
	if (locale === "en") return __en.locale_name_kk(inputs)
	return __ru.locale_name_kk(inputs)
});
/**
* | output |
* | --- |
* | "Русский" |
*
* @param {Locale_Name_RuInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_ru = /** @type {((inputs?: Locale_Name_RuInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Locale_Name_RuInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.locale_name_ru(inputs)
	if (locale === "en") return __en.locale_name_ru(inputs)
	return __ru.locale_name_ru(inputs)
});
/**
* | output |
* | --- |
* | "The login name or password is not correct." |
*
* @param {Login_FailedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_failed = /** @type {((inputs?: Login_FailedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_FailedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.login_failed(inputs)
	if (locale === "en") return __en.login_failed(inputs)
	return __ru.login_failed(inputs)
});
/**
* | output |
* | --- |
* | "Sign in with the account your system administrator created." |
*
* @param {Login_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_hint = /** @type {((inputs?: Login_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.login_hint(inputs)
	if (locale === "en") return __en.login_hint(inputs)
	return __ru.login_hint(inputs)
});
/**
* | output |
* | --- |
* | "Accounts are created by the system administrator. Ask them if you have no sign-in or have forgotten your password." |
*
* @param {Login_No_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_no_account = /** @type {((inputs?: Login_No_AccountInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_No_AccountInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.login_no_account(inputs)
	if (locale === "en") return __en.login_no_account(inputs)
	return __ru.login_no_account(inputs)
});
/**
* | output |
* | --- |
* | "Password" |
*
* @param {Login_PasswordInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_password = /** @type {((inputs?: Login_PasswordInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_PasswordInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.login_password(inputs)
	if (locale === "en") return __en.login_password(inputs)
	return __ru.login_password(inputs)
});
/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Login_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_submit = /** @type {((inputs?: Login_SubmitInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_SubmitInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.login_submit(inputs)
	if (locale === "en") return __en.login_submit(inputs)
	return __ru.login_submit(inputs)
});
/**
* | output |
* | --- |
* | "Too many sign-in attempts. Wait a moment and try again." |
*
* @param {Login_ThrottledInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_throttled = /** @type {((inputs?: Login_ThrottledInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_ThrottledInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.login_throttled(inputs)
	if (locale === "en") return __en.login_throttled(inputs)
	return __ru.login_throttled(inputs)
});
/**
* | output |
* | --- |
* | "Sign in to the internal contour" |
*
* @param {Login_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_title = /** @type {((inputs?: Login_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.login_title(inputs)
	if (locale === "en") return __en.login_title(inputs)
	return __ru.login_title(inputs)
});
/**
* | output |
* | --- |
* | "Login name" |
*
* @param {Login_UsernameInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_username = /** @type {((inputs?: Login_UsernameInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_UsernameInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.login_username(inputs)
	if (locale === "en") return __en.login_username(inputs)
	return __ru.login_username(inputs)
});
/**
* | output |
* | --- |
* | "Sign out" |
*
* @param {Logout_ButtonInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const logout_button = /** @type {((inputs?: Logout_ButtonInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Logout_ButtonInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.logout_button(inputs)
	if (locale === "en") return __en.logout_button(inputs)
	return __ru.logout_button(inputs)
});
/**
* | output |
* | --- |
* | "Page not found" |
*
* @param {Not_Found_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const not_found_title = /** @type {((inputs?: Not_Found_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Not_Found_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.not_found_title(inputs)
	if (locale === "en") return __en.not_found_title(inputs)
	return __ru.not_found_title(inputs)
});
/**
* | output |
* | --- |
* | "Academic Integrity - Open Statistics" |
*
* @param {Public_Contour_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const public_contour_title = /** @type {((inputs?: Public_Contour_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Public_Contour_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.public_contour_title(inputs)
	if (locale === "en") return __en.public_contour_title(inputs)
	return __ru.public_contour_title(inputs)
});
/**
* | output |
* | --- |
* | "Rechecks by unit" |
*
* @param {Rechecks_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rechecks_units_title = /** @type {((inputs?: Rechecks_Units_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rechecks_Units_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rechecks_units_title(inputs)
	if (locale === "en") return __en.rechecks_units_title(inputs)
	return __ru.rechecks_units_title(inputs)
});
/**
* | output |
* | --- |
* | "Files" |
*
* @param {Report_FilesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_files = /** @type {((inputs?: Report_FilesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_FilesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_files(inputs)
	if (locale === "en") return __en.report_files(inputs)
	return __ru.report_files(inputs)
});
/**
* | output |
* | --- |
* | "Available once published" |
*
* @param {Report_Files_After_PublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_files_after_publish = /** @type {((inputs?: Report_Files_After_PublishInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Files_After_PublishInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_files_after_publish(inputs)
	if (locale === "en") return __en.report_files_after_publish(inputs)
	return __ru.report_files_after_publish(inputs)
});
/**
* | output |
* | --- |
* | "Generate report" |
*
* @param {Report_GenerateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generate = /** @type {((inputs?: Report_GenerateInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_GenerateInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_generate(inputs)
	if (locale === "en") return __en.report_generate(inputs)
	return __ru.report_generate(inputs)
});
/**
* | output |
* | --- |
* | "The annual report runs 1 September – 31 August; a manual report takes any date range." |
*
* @param {Report_Generate_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generate_hint = /** @type {((inputs?: Report_Generate_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Generate_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_generate_hint(inputs)
	if (locale === "en") return __en.report_generate_hint(inputs)
	return __ru.report_generate_hint(inputs)
});
/**
* | output |
* | --- |
* | "Generated" |
*
* @param {Report_Generated_AtInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generated_at = /** @type {((inputs?: Report_Generated_AtInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Generated_AtInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_generated_at(inputs)
	if (locale === "en") return __en.report_generated_at(inputs)
	return __ru.report_generated_at(inputs)
});
/**
* | output |
* | --- |
* | "The report has been generated" |
*
* @param {Report_Generated_OkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generated_ok = /** @type {((inputs?: Report_Generated_OkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Generated_OkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_generated_ok(inputs)
	if (locale === "en") return __en.report_generated_ok(inputs)
	return __ru.report_generated_ok(inputs)
});
/**
* | output |
* | --- |
* | "Report kind" |
*
* @param {Report_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_kind = /** @type {((inputs?: Report_KindInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_KindInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_kind(inputs)
	if (locale === "en") return __en.report_kind(inputs)
	return __ru.report_kind(inputs)
});
/**
* | output |
* | --- |
* | "Report language" |
*
* @param {Report_LocaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_locale = /** @type {((inputs?: Report_LocaleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_LocaleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_locale(inputs)
	if (locale === "en") return __en.report_locale(inputs)
	return __ru.report_locale(inputs)
});
/**
* | output |
* | --- |
* | "No reports have been generated yet." |
*
* @param {Report_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_none = /** @type {((inputs?: Report_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_none(inputs)
	if (locale === "en") return __en.report_none(inputs)
	return __ru.report_none(inputs)
});
/**
* | output |
* | --- |
* | "Period" |
*
* @param {Report_PeriodInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_period = /** @type {((inputs?: Report_PeriodInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_PeriodInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_period(inputs)
	if (locale === "en") return __en.report_period(inputs)
	return __ru.report_period(inputs)
});
/**
* | output |
* | --- |
* | "Publish" |
*
* @param {Report_PublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_publish = /** @type {((inputs?: Report_PublishInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_PublishInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_publish(inputs)
	if (locale === "en") return __en.report_publish(inputs)
	return __ru.report_publish(inputs)
});
/**
* | output |
* | --- |
* | "Published" |
*
* @param {Report_PublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_published = /** @type {((inputs?: Report_PublishedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_PublishedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_published(inputs)
	if (locale === "en") return __en.report_published(inputs)
	return __ru.report_published(inputs)
});
/**
* | output |
* | --- |
* | "Publication" |
*
* @param {Report_Published_StateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_published_state = /** @type {((inputs?: Report_Published_StateInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Published_StateInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_published_state(inputs)
	if (locale === "en") return __en.report_published_state(inputs)
	return __ru.report_published_state(inputs)
});
/**
* | output |
* | --- |
* | "Unpublish" |
*
* @param {Report_UnpublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_unpublish = /** @type {((inputs?: Report_UnpublishInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_UnpublishInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_unpublish(inputs)
	if (locale === "en") return __en.report_unpublish(inputs)
	return __ru.report_unpublish(inputs)
});
/**
* | output |
* | --- |
* | "Not published" |
*
* @param {Report_UnpublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_unpublished = /** @type {((inputs?: Report_UnpublishedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_UnpublishedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.report_unpublished(inputs)
	if (locale === "en") return __en.report_unpublished(inputs)
	return __ru.report_unpublished(inputs)
});
/**
* | output |
* | --- |
* | "Download {format}" |
*
* @param {Reports_DownloadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_download = /** @type {((inputs: Reports_DownloadInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_DownloadInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.reports_download(inputs)
	if (locale === "en") return __en.reports_download(inputs)
	return __ru.reports_download(inputs)
});
/**
* | output |
* | --- |
* | "No reports have been published yet." |
*
* @param {Reports_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_empty = /** @type {((inputs?: Reports_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.reports_empty(inputs)
	if (locale === "en") return __en.reports_empty(inputs)
	return __ru.reports_empty(inputs)
});
/**
* | output |
* | --- |
* | "Generated {date}" |
*
* @param {Reports_GeneratedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_generated = /** @type {((inputs: Reports_GeneratedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_GeneratedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.reports_generated(inputs)
	if (locale === "en") return __en.reports_generated(inputs)
	return __ru.reports_generated(inputs)
});
/**
* | output |
* | --- |
* | "Annual report" |
*
* @param {Reports_Kind_AnnualInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_kind_annual = /** @type {((inputs?: Reports_Kind_AnnualInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_Kind_AnnualInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.reports_kind_annual(inputs)
	if (locale === "en") return __en.reports_kind_annual(inputs)
	return __ru.reports_kind_annual(inputs)
});
/**
* | output |
* | --- |
* | "Period report" |
*
* @param {Reports_Kind_ManualInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_kind_manual = /** @type {((inputs?: Reports_Kind_ManualInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_Kind_ManualInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.reports_kind_manual(inputs)
	if (locale === "en") return __en.reports_kind_manual(inputs)
	return __ru.reports_kind_manual(inputs)
});
/**
* | output |
* | --- |
* | "Your account" |
*
* @param {Request_Access_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_account = /** @type {((inputs?: Request_Access_AccountInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_AccountInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.request_access_account(inputs)
	if (locale === "en") return __en.request_access_account(inputs)
	return __ru.request_access_account(inputs)
});
/**
* | output |
* | --- |
* | "Back to the public statistics" |
*
* @param {Request_Access_BackInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_back = /** @type {((inputs?: Request_Access_BackInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_BackInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.request_access_back(inputs)
	if (locale === "en") return __en.request_access_back(inputs)
	return __ru.request_access_back(inputs)
});
/**
* | output |
* | --- |
* | "You are signed in, but your account has no rights to the internal contour. Access is granted on a request from the head of your unit, agreed with the system ..." |
*
* @param {Request_Access_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_body = /** @type {((inputs?: Request_Access_BodyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_BodyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.request_access_body(inputs)
	if (locale === "en") return __en.request_access_body(inputs)
	return __ru.request_access_body(inputs)
});
/**
* | output |
* | --- |
* | "The teaching-staff role covers the public contour. Unit-level detail needs a separate role." |
*
* @param {Request_Access_Staff_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_staff_note = /** @type {((inputs?: Request_Access_Staff_NoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_Staff_NoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.request_access_staff_note(inputs)
	if (locale === "en") return __en.request_access_staff_note(inputs)
	return __ru.request_access_staff_note(inputs)
});
/**
* | output |
* | --- |
* | "The system administrator grants the role and its scope - a faculty or a department." |
*
* @param {Request_Access_Step_AdminInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_admin = /** @type {((inputs?: Request_Access_Step_AdminInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_Step_AdminInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.request_access_step_admin(inputs)
	if (locale === "en") return __en.request_access_step_admin(inputs)
	return __ru.request_access_step_admin(inputs)
});
/**
* | output |
* | --- |
* | "The head of your unit submits an access request." |
*
* @param {Request_Access_Step_HeadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_head = /** @type {((inputs?: Request_Access_Step_HeadInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_Step_HeadInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.request_access_step_head(inputs)
	if (locale === "en") return __en.request_access_step_head(inputs)
	return __ru.request_access_step_head(inputs)
});
/**
* | output |
* | --- |
* | "Sign in again once the role is granted, and the section opens." |
*
* @param {Request_Access_Step_SigninInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_signin = /** @type {((inputs?: Request_Access_Step_SigninInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_Step_SigninInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.request_access_step_signin(inputs)
	if (locale === "en") return __en.request_access_step_signin(inputs)
	return __ru.request_access_step_signin(inputs)
});
/**
* | output |
* | --- |
* | "No access to the internal contour" |
*
* @param {Request_Access_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_title = /** @type {((inputs?: Request_Access_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.request_access_title(inputs)
	if (locale === "en") return __en.request_access_title(inputs)
	return __ru.request_access_title(inputs)
});
/**
* | output |
* | --- |
* | "Administrator" |
*
* @param {Role_AdminInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_admin = /** @type {((inputs?: Role_AdminInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_AdminInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.role_admin(inputs)
	if (locale === "en") return __en.role_admin(inputs)
	return __ru.role_admin(inputs)
});
/**
* | output |
* | --- |
* | "Compliance office" |
*
* @param {Role_ComplianceInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_compliance = /** @type {((inputs?: Role_ComplianceInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_ComplianceInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.role_compliance(inputs)
	if (locale === "en") return __en.role_compliance(inputs)
	return __ru.role_compliance(inputs)
});
/**
* | output |
* | --- |
* | "Dean" |
*
* @param {Role_DeanInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_dean = /** @type {((inputs?: Role_DeanInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_DeanInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.role_dean(inputs)
	if (locale === "en") return __en.role_dean(inputs)
	return __ru.role_dean(inputs)
});
/**
* | output |
* | --- |
* | "Head of department" |
*
* @param {Role_Dept_HeadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_dept_head = /** @type {((inputs?: Role_Dept_HeadInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_Dept_HeadInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.role_dept_head(inputs)
	if (locale === "en") return __en.role_dept_head(inputs)
	return __ru.role_dept_head(inputs)
});
/**
* | output |
* | --- |
* | "Ethics officer" |
*
* @param {Role_EthicsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_ethics = /** @type {((inputs?: Role_EthicsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_EthicsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.role_ethics(inputs)
	if (locale === "en") return __en.role_ethics(inputs)
	return __ru.role_ethics(inputs)
});
/**
* | output |
* | --- |
* | "No role" |
*
* @param {Role_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_none = /** @type {((inputs?: Role_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.role_none(inputs)
	if (locale === "en") return __en.role_none(inputs)
	return __ru.role_none(inputs)
});
/**
* | output |
* | --- |
* | "Teaching staff" |
*
* @param {Role_StaffInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_staff = /** @type {((inputs?: Role_StaffInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_StaffInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.role_staff(inputs)
	if (locale === "en") return __en.role_staff(inputs)
	return __ru.role_staff(inputs)
});
/**
* | output |
* | --- |
* | "Account" |
*
* @param {Roles_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_account = /** @type {((inputs?: Roles_AccountInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_AccountInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_account(inputs)
	if (locale === "en") return __en.roles_account(inputs)
	return __ru.roles_account(inputs)
});
/**
* | output |
* | --- |
* | "State" |
*
* @param {Roles_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_active = /** @type {((inputs?: Roles_ActiveInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_ActiveInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_active(inputs)
	if (locale === "en") return __en.roles_active(inputs)
	return __ru.roles_active(inputs)
});
/**
* | output |
* | --- |
* | "Disabled" |
*
* @param {Roles_Active_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_active_no = /** @type {((inputs?: Roles_Active_NoInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Active_NoInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_active_no(inputs)
	if (locale === "en") return __en.roles_active_no(inputs)
	return __ru.roles_active_no(inputs)
});
/**
* | output |
* | --- |
* | "Active" |
*
* @param {Roles_Active_YesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_active_yes = /** @type {((inputs?: Roles_Active_YesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Active_YesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_active_yes(inputs)
	if (locale === "en") return __en.roles_active_yes(inputs)
	return __ru.roles_active_yes(inputs)
});
/**
* | output |
* | --- |
* | "Grant a role" |
*
* @param {Roles_GrantInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant = /** @type {((inputs?: Roles_GrantInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_GrantInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_grant(inputs)
	if (locale === "en") return __en.roles_grant(inputs)
	return __ru.roles_grant(inputs)
});
/**
* | output |
* | --- |
* | "A dean needs a faculty code, a head of department a department code." |
*
* @param {Roles_Grant_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant_hint = /** @type {((inputs?: Roles_Grant_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Grant_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_grant_hint(inputs)
	if (locale === "en") return __en.roles_grant_hint(inputs)
	return __ru.roles_grant_hint(inputs)
});
/**
* | output |
* | --- |
* | "Grant" |
*
* @param {Roles_Grant_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant_submit = /** @type {((inputs?: Roles_Grant_SubmitInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Grant_SubmitInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_grant_submit(inputs)
	if (locale === "en") return __en.roles_grant_submit(inputs)
	return __ru.roles_grant_submit(inputs)
});
/**
* | output |
* | --- |
* | "Grants" |
*
* @param {Roles_GrantsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grants = /** @type {((inputs?: Roles_GrantsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_GrantsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_grants(inputs)
	if (locale === "en") return __en.roles_grants(inputs)
	return __ru.roles_grants(inputs)
});
/**
* | output |
* | --- |
* | "No accounts." |
*
* @param {Roles_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_none = /** @type {((inputs?: Roles_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_none(inputs)
	if (locale === "en") return __en.roles_none(inputs)
	return __ru.roles_none(inputs)
});
/**
* | output |
* | --- |
* | "Revoke the role" |
*
* @param {Roles_RevokeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_revoke = /** @type {((inputs?: Roles_RevokeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_RevokeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_revoke(inputs)
	if (locale === "en") return __en.roles_revoke(inputs)
	return __ru.roles_revoke(inputs)
});
/**
* | output |
* | --- |
* | "Role" |
*
* @param {Roles_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_role = /** @type {((inputs?: Roles_RoleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_RoleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_role(inputs)
	if (locale === "en") return __en.roles_role(inputs)
	return __ru.roles_role(inputs)
});
/**
* | output |
* | --- |
* | "Scope: department" |
*
* @param {Roles_Scope_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_department = /** @type {((inputs?: Roles_Scope_DepartmentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_DepartmentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_scope_department(inputs)
	if (locale === "en") return __en.roles_scope_department(inputs)
	return __ru.roles_scope_department(inputs)
});
/**
* | output |
* | --- |
* | "Required for a head of department" |
*
* @param {Roles_Scope_Department_RequiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_department_required = /** @type {((inputs?: Roles_Scope_Department_RequiredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_Department_RequiredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_scope_department_required(inputs)
	if (locale === "en") return __en.roles_scope_department_required(inputs)
	return __ru.roles_scope_department_required(inputs)
});
/**
* | output |
* | --- |
* | "Scope: faculty" |
*
* @param {Roles_Scope_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_faculty = /** @type {((inputs?: Roles_Scope_FacultyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_FacultyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_scope_faculty(inputs)
	if (locale === "en") return __en.roles_scope_faculty(inputs)
	return __ru.roles_scope_faculty(inputs)
});
/**
* | output |
* | --- |
* | "Required for a dean" |
*
* @param {Roles_Scope_Faculty_RequiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_faculty_required = /** @type {((inputs?: Roles_Scope_Faculty_RequiredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_Faculty_RequiredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_scope_faculty_required(inputs)
	if (locale === "en") return __en.roles_scope_faculty_required(inputs)
	return __ru.roles_scope_faculty_required(inputs)
});
/**
* | output |
* | --- |
* | "Unrestricted" |
*
* @param {Roles_Scope_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_none = /** @type {((inputs?: Roles_Scope_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_scope_none(inputs)
	if (locale === "en") return __en.roles_scope_none(inputs)
	return __ru.roles_scope_none(inputs)
});
/**
* | output |
* | --- |
* | "SSO subject" |
*
* @param {Roles_SubjectInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_subject = /** @type {((inputs?: Roles_SubjectInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_SubjectInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.roles_subject(inputs)
	if (locale === "en") return __en.roles_subject(inputs)
	return __ru.roles_subject(inputs)
});
/**
* | output |
* | --- |
* | "Enable" |
*
* @param {Rule_ActivateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_activate = /** @type {((inputs?: Rule_ActivateInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_ActivateInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_activate(inputs)
	if (locale === "en") return __en.rule_activate(inputs)
	return __ru.rule_activate(inputs)
});
/**
* | output |
* | --- |
* | "Active" |
*
* @param {Rule_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_active = /** @type {((inputs?: Rule_ActiveInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_ActiveInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_active(inputs)
	if (locale === "en") return __en.rule_active(inputs)
	return __ru.rule_active(inputs)
});
/**
* | output |
* | --- |
* | "Disable" |
*
* @param {Rule_DeactivateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_deactivate = /** @type {((inputs?: Rule_DeactivateInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_DeactivateInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_deactivate(inputs)
	if (locale === "en") return __en.rule_deactivate(inputs)
	return __ru.rule_deactivate(inputs)
});
/**
* | output |
* | --- |
* | "Initiator" |
*
* @param {Rule_InitiatorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_initiator = /** @type {((inputs?: Rule_InitiatorInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_InitiatorInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_initiator(inputs)
	if (locale === "en") return __en.rule_initiator(inputs)
	return __ru.rule_initiator(inputs)
});
/**
* | output |
* | --- |
* | "No rules defined." |
*
* @param {Rule_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_none = /** @type {((inputs?: Rule_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_none(inputs)
	if (locale === "en") return __en.rule_none(inputs)
	return __ru.rule_none(inputs)
});
/**
* | output |
* | --- |
* | "Pattern" |
*
* @param {Rule_PatternInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_pattern = /** @type {((inputs?: Rule_PatternInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_PatternInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_pattern(inputs)
	if (locale === "en") return __en.rule_pattern(inputs)
	return __ru.rule_pattern(inputs)
});
/**
* | output |
* | --- |
* | "Substring matched against the normalized work title." |
*
* @param {Rule_Pattern_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_pattern_hint = /** @type {((inputs?: Rule_Pattern_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_Pattern_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_pattern_hint(inputs)
	if (locale === "en") return __en.rule_pattern_hint(inputs)
	return __ru.rule_pattern_hint(inputs)
});
/**
* | output |
* | --- |
* | "Priority" |
*
* @param {Rule_PriorityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_priority = /** @type {((inputs?: Rule_PriorityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_PriorityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_priority(inputs)
	if (locale === "en") return __en.rule_priority(inputs)
	return __ru.rule_priority(inputs)
});
/**
* | output |
* | --- |
* | "The lowest value wins." |
*
* @param {Rule_Priority_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_priority_hint = /** @type {((inputs?: Rule_Priority_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_Priority_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_priority_hint(inputs)
	if (locale === "en") return __en.rule_priority_hint(inputs)
	return __ru.rule_priority_hint(inputs)
});
/**
* | output |
* | --- |
* | "Regular expression over the normalized reviewer address." |
*
* @param {Rule_Regex_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_regex_hint = /** @type {((inputs?: Rule_Regex_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_Regex_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_regex_hint(inputs)
	if (locale === "en") return __en.rule_regex_hint(inputs)
	return __ru.rule_regex_hint(inputs)
});
/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Rule_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_work_type = /** @type {((inputs?: Rule_Work_TypeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_Work_TypeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.rule_work_type(inputs)
	if (locale === "en") return __en.rule_work_type(inputs)
	return __ru.rule_work_type(inputs)
});
/**
* | output |
* | --- |
* | "The whole university" |
*
* @param {Scope_AllInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_all = /** @type {((inputs?: Scope_AllInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Scope_AllInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.scope_all(inputs)
	if (locale === "en") return __en.scope_all(inputs)
	return __ru.scope_all(inputs)
});
/**
* | output |
* | --- |
* | "Within the department" |
*
* @param {Scope_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_department = /** @type {((inputs?: Scope_DepartmentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Scope_DepartmentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.scope_department(inputs)
	if (locale === "en") return __en.scope_department(inputs)
	return __ru.scope_department(inputs)
});
/**
* | output |
* | --- |
* | "Within the faculty" |
*
* @param {Scope_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_faculty = /** @type {((inputs?: Scope_FacultyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Scope_FacultyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.scope_faculty(inputs)
	if (locale === "en") return __en.scope_faculty(inputs)
	return __ru.scope_faculty(inputs)
});
/**
* | output |
* | --- |
* | "No scope" |
*
* @param {Scope_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_none = /** @type {((inputs?: Scope_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Scope_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.scope_none(inputs)
	if (locale === "en") return __en.scope_none(inputs)
	return __ru.scope_none(inputs)
});
/**
* | output |
* | --- |
* | "Trends over time" |
*
* @param {Section_DynamicsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_dynamics = /** @type {((inputs?: Section_DynamicsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_DynamicsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_dynamics(inputs)
	if (locale === "en") return __en.section_dynamics(inputs)
	return __ru.section_dynamics(inputs)
});
/**
* | output |
* | --- |
* | "Number of checks and average originality by month." |
*
* @param {Section_Dynamics_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_dynamics_hint = /** @type {((inputs?: Section_Dynamics_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Dynamics_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_dynamics_hint(inputs)
	if (locale === "en") return __en.section_dynamics_hint(inputs)
	return __ru.section_dynamics_hint(inputs)
});
/**
* | output |
* | --- |
* | "This section could not be loaded" |
*
* @param {Section_Error_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_error_title = /** @type {((inputs?: Section_Error_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Error_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_error_title(inputs)
	if (locale === "en") return __en.section_error_title(inputs)
	return __ru.section_error_title(inputs)
});
/**
* | output |
* | --- |
* | "The service is temporarily unavailable." |
*
* @param {Section_Error_UnavailableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_error_unavailable = /** @type {((inputs?: Section_Error_UnavailableInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Error_UnavailableInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_error_unavailable(inputs)
	if (locale === "en") return __en.section_error_unavailable(inputs)
	return __ru.section_error_unavailable(inputs)
});
/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Section_EscalationsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_escalations = /** @type {((inputs?: Section_EscalationsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_EscalationsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_escalations(inputs)
	if (locale === "en") return __en.section_escalations(inputs)
	return __ru.section_escalations(inputs)
});
/**
* | output |
* | --- |
* | "Aggregated counters of cases referred to the Ethics Council, with no personal data." |
*
* @param {Section_Escalations_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_escalations_hint = /** @type {((inputs?: Section_Escalations_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Escalations_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_escalations_hint(inputs)
	if (locale === "en") return __en.section_escalations_hint(inputs)
	return __ru.section_escalations_hint(inputs)
});
/**
* | output |
* | --- |
* | "By faculty" |
*
* @param {Section_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_faculties = /** @type {((inputs?: Section_FacultiesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_FacultiesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_faculties(inputs)
	if (locale === "en") return __en.section_faculties(inputs)
	return __ru.section_faculties(inputs)
});
/**
* | output |
* | --- |
* | "Aggregated figures per faculty and institute." |
*
* @param {Section_Faculties_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_faculties_hint = /** @type {((inputs?: Section_Faculties_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Faculties_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_faculties_hint(inputs)
	if (locale === "en") return __en.section_faculties_hint(inputs)
	return __ru.section_faculties_hint(inputs)
});
/**
* | output |
* | --- |
* | "Originality distribution" |
*
* @param {Section_HistogramInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_histogram = /** @type {((inputs?: Section_HistogramInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_HistogramInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_histogram(inputs)
	if (locale === "en") return __en.section_histogram(inputs)
	return __ru.section_histogram(inputs)
});
/**
* | output |
* | --- |
* | "How checks are distributed across the originality bands." |
*
* @param {Section_Histogram_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_histogram_hint = /** @type {((inputs?: Section_Histogram_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Histogram_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_histogram_hint(inputs)
	if (locale === "en") return __en.section_histogram_hint(inputs)
	return __ru.section_histogram_hint(inputs)
});
/**
* | output |
* | --- |
* | "{section} - in development" |
*
* @param {Section_In_DevelopmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_in_development = /** @type {((inputs: Section_In_DevelopmentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_In_DevelopmentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_in_development(inputs)
	if (locale === "en") return __en.section_in_development(inputs)
	return __ru.section_in_development(inputs)
});
/**
* | output |
* | --- |
* | "Loading data" |
*
* @param {Section_LoadingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_loading = /** @type {((inputs?: Section_LoadingInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_LoadingInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_loading(inputs)
	if (locale === "en") return __en.section_loading(inputs)
	return __ru.section_loading(inputs)
});
/**
* | output |
* | --- |
* | "Overview" |
*
* @param {Section_OverviewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_overview = /** @type {((inputs?: Section_OverviewInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_OverviewInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_overview(inputs)
	if (locale === "en") return __en.section_overview(inputs)
	return __ru.section_overview(inputs)
});
/**
* | output |
* | --- |
* | "Headline figures for the selected period and the change against the same period a year earlier." |
*
* @param {Section_Overview_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_overview_hint = /** @type {((inputs?: Section_Overview_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Overview_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_overview_hint(inputs)
	if (locale === "en") return __en.section_overview_hint(inputs)
	return __ru.section_overview_hint(inputs)
});
/**
* | output |
* | --- |
* | "Rechecks" |
*
* @param {Section_RechecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_rechecks = /** @type {((inputs?: Section_RechecksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_RechecksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_rechecks(inputs)
	if (locale === "en") return __en.section_rechecks(inputs)
	return __ru.section_rechecks(inputs)
});
/**
* | output |
* | --- |
* | "The share of works rechecked after revision, and how many of them improved." |
*
* @param {Section_Rechecks_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_rechecks_hint = /** @type {((inputs?: Section_Rechecks_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Rechecks_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_rechecks_hint(inputs)
	if (locale === "en") return __en.section_rechecks_hint(inputs)
	return __ru.section_rechecks_hint(inputs)
});
/**
* | output |
* | --- |
* | "Published reports" |
*
* @param {Section_ReportsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_reports = /** @type {((inputs?: Section_ReportsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_ReportsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_reports(inputs)
	if (locale === "en") return __en.section_reports(inputs)
	return __ru.section_reports(inputs)
});
/**
* | output |
* | --- |
* | "Annual and ad-hoc anonymized reports." |
*
* @param {Section_Reports_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_reports_hint = /** @type {((inputs?: Section_Reports_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Reports_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_reports_hint(inputs)
	if (locale === "en") return __en.section_reports_hint(inputs)
	return __ru.section_reports_hint(inputs)
});
/**
* | output |
* | --- |
* | "Retry" |
*
* @param {Section_RetryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_retry = /** @type {((inputs?: Section_RetryInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_RetryInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_retry(inputs)
	if (locale === "en") return __en.section_retry(inputs)
	return __ru.section_retry(inputs)
});
/**
* | output |
* | --- |
* | "This section is available to the ethics council and the compliance service. If you need it for your work, contact the system administrator." |
*
* @param {Section_Role_RestrictedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_role_restricted = /** @type {((inputs?: Section_Role_RestrictedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Role_RestrictedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_role_restricted(inputs)
	if (locale === "en") return __en.section_role_restricted(inputs)
	return __ru.section_role_restricted(inputs)
});
/**
* | output |
* | --- |
* | "By faculty and department" |
*
* @param {Section_UnitsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_units = /** @type {((inputs?: Section_UnitsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_UnitsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_units(inputs)
	if (locale === "en") return __en.section_units(inputs)
	return __ru.section_units(inputs)
});
/**
* | output |
* | --- |
* | "Faculty metrics, expandable to departments." |
*
* @param {Section_Units_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_units_hint = /** @type {((inputs?: Section_Units_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Units_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_units_hint(inputs)
	if (locale === "en") return __en.section_units_hint(inputs)
	return __ru.section_units_hint(inputs)
});
/**
* | output |
* | --- |
* | "System usage" |
*
* @param {Section_UsageInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_usage = /** @type {((inputs?: Section_UsageInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_UsageInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_usage(inputs)
	if (locale === "en") return __en.section_usage(inputs)
	return __ru.section_usage(inputs)
});
/**
* | output |
* | --- |
* | "Active reviewers per month and the average check duration." |
*
* @param {Section_Usage_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_usage_hint = /** @type {((inputs?: Section_Usage_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Usage_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_usage_hint(inputs)
	if (locale === "en") return __en.section_usage_hint(inputs)
	return __ru.section_usage_hint(inputs)
});
/**
* | output |
* | --- |
* | "By work type" |
*
* @param {Section_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_work_types = /** @type {((inputs?: Section_Work_TypesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Work_TypesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_work_types(inputs)
	if (locale === "en") return __en.section_work_types(inputs)
	return __ru.section_work_types(inputs)
});
/**
* | output |
* | --- |
* | "Checks and average originality broken down by type of written work." |
*
* @param {Section_Work_Types_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_work_types_hint = /** @type {((inputs?: Section_Work_Types_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Work_Types_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_work_types_hint(inputs)
	if (locale === "en") return __en.section_work_types_hint(inputs)
	return __ru.section_work_types_hint(inputs)
});
/**
* | output |
* | --- |
* | "Year over year" |
*
* @param {Section_YoyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_yoy = /** @type {((inputs?: Section_YoyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_YoyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_yoy(inputs)
	if (locale === "en") return __en.section_yoy(inputs)
	return __ru.section_yoy(inputs)
});
/**
* | output |
* | --- |
* | "The figures compared by academic year (1 September - 31 August)." |
*
* @param {Section_Yoy_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_yoy_hint = /** @type {((inputs?: Section_Yoy_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Yoy_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.section_yoy_hint(inputs)
	if (locale === "en") return __en.section_yoy_hint(inputs)
	return __ru.section_yoy_hint(inputs)
});
/**
* | output |
* | --- |
* | "Autumn semester start" |
*
* @param {Setting_Autumn_StartInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_autumn_start = /** @type {((inputs?: Setting_Autumn_StartInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Autumn_StartInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_autumn_start(inputs)
	if (locale === "en") return __en.setting_autumn_start(inputs)
	return __ru.setting_autumn_start(inputs)
});
/**
* | output |
* | --- |
* | "Exclude deleted documents" |
*
* @param {Setting_Exclude_DeletedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_exclude_deleted = /** @type {((inputs?: Setting_Exclude_DeletedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Exclude_DeletedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_exclude_deleted(inputs)
	if (locale === "en") return __en.setting_exclude_deleted(inputs)
	return __ru.setting_exclude_deleted(inputs)
});
/**
* | output |
* | --- |
* | "Rows marked deleted stay out of the aggregates." |
*
* @param {Setting_Exclude_Deleted_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_exclude_deleted_hint = /** @type {((inputs?: Setting_Exclude_Deleted_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Exclude_Deleted_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_exclude_deleted_hint(inputs)
	if (locale === "en") return __en.setting_exclude_deleted_hint(inputs)
	return __ru.setting_exclude_deleted_hint(inputs)
});
/**
* | output |
* | --- |
* | "Originality band edges" |
*
* @param {Setting_Histogram_BucketsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets = /** @type {((inputs?: Setting_Histogram_BucketsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Histogram_BucketsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_histogram_buckets(inputs)
	if (locale === "en") return __en.setting_histogram_buckets(inputs)
	return __ru.setting_histogram_buckets(inputs)
});
/**
* | output |
* | --- |
* | "Percentages, comma separated and ascending, e.g. 50, 70, 85, 95." |
*
* @param {Setting_Histogram_Buckets_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets_hint = /** @type {((inputs?: Setting_Histogram_Buckets_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Histogram_Buckets_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_histogram_buckets_hint(inputs)
	if (locale === "en") return __en.setting_histogram_buckets_hint(inputs)
	return __ru.setting_histogram_buckets_hint(inputs)
});
/**
* | output |
* | --- |
* | "Edges must ascend and stay between 0 and 100" |
*
* @param {Setting_Histogram_Buckets_InvalidInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets_invalid = /** @type {((inputs?: Setting_Histogram_Buckets_InvalidInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Histogram_Buckets_InvalidInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_histogram_buckets_invalid(inputs)
	if (locale === "en") return __en.setting_histogram_buckets_invalid(inputs)
	return __ru.setting_histogram_buckets_invalid(inputs)
});
/**
* | output |
* | --- |
* | "k-anonymity threshold" |
*
* @param {Setting_K_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_k_threshold = /** @type {((inputs?: Setting_K_ThresholdInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_K_ThresholdInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_k_threshold(inputs)
	if (locale === "en") return __en.setting_k_threshold(inputs)
	return __ru.setting_k_threshold(inputs)
});
/**
* | output |
* | --- |
* | "Groups smaller than k are not published. The recommended value is 5." |
*
* @param {Setting_K_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_k_threshold_hint = /** @type {((inputs?: Setting_K_Threshold_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_K_Threshold_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_k_threshold_hint(inputs)
	if (locale === "en") return __en.setting_k_threshold_hint(inputs)
	return __ru.setting_k_threshold_hint(inputs)
});
/**
* | output |
* | --- |
* | "Originality threshold, %" |
*
* @param {Setting_Originality_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_originality_threshold = /** @type {((inputs?: Setting_Originality_ThresholdInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Originality_ThresholdInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_originality_threshold(inputs)
	if (locale === "en") return __en.setting_originality_threshold(inputs)
	return __ru.setting_originality_threshold(inputs)
});
/**
* | output |
* | --- |
* | "Works below the threshold count as needing attention. The default is 70." |
*
* @param {Setting_Originality_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_originality_threshold_hint = /** @type {((inputs?: Setting_Originality_Threshold_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Originality_Threshold_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_originality_threshold_hint(inputs)
	if (locale === "en") return __en.setting_originality_threshold_hint(inputs)
	return __ru.setting_originality_threshold_hint(inputs)
});
/**
* | output |
* | --- |
* | "Format MM-DD." |
*
* @param {Setting_Semester_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_semester_hint = /** @type {((inputs?: Setting_Semester_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Semester_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_semester_hint(inputs)
	if (locale === "en") return __en.setting_semester_hint(inputs)
	return __ru.setting_semester_hint(inputs)
});
/**
* | output |
* | --- |
* | "Public snapshot quarter" |
*
* @param {Setting_Snapshot_QuarterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_snapshot_quarter = /** @type {((inputs?: Setting_Snapshot_QuarterInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Snapshot_QuarterInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_snapshot_quarter(inputs)
	if (locale === "en") return __en.setting_snapshot_quarter(inputs)
	return __ru.setting_snapshot_quarter(inputs)
});
/**
* | output |
* | --- |
* | "«auto» - together with the internal refresh." |
*
* @param {Setting_Snapshot_Quarter_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_snapshot_quarter_hint = /** @type {((inputs?: Setting_Snapshot_Quarter_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Snapshot_Quarter_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_snapshot_quarter_hint(inputs)
	if (locale === "en") return __en.setting_snapshot_quarter_hint(inputs)
	return __ru.setting_snapshot_quarter_hint(inputs)
});
/**
* | output |
* | --- |
* | "Spring semester start" |
*
* @param {Setting_Spring_StartInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_spring_start = /** @type {((inputs?: Setting_Spring_StartInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Spring_StartInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_spring_start(inputs)
	if (locale === "en") return __en.setting_spring_start(inputs)
	return __ru.setting_spring_start(inputs)
});
/**
* | output |
* | --- |
* | "Status derivation rules" |
*
* @param {Setting_Status_RulesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_status_rules = /** @type {((inputs?: Setting_Status_RulesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Status_RulesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_status_rules(inputs)
	if (locale === "en") return __en.setting_status_rules(inputs)
	return __ru.setting_status_rules(inputs)
});
/**
* | output |
* | --- |
* | "JSON: default, escalate_when and a list of status/when rules." |
*
* @param {Setting_Status_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_status_rules_hint = /** @type {((inputs?: Setting_Status_Rules_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Status_Rules_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.setting_status_rules_hint(inputs)
	if (locale === "en") return __en.setting_status_rules_hint(inputs)
	return __ru.setting_status_rules_hint(inputs)
});
/**
* | output |
* | --- |
* | "Save settings" |
*
* @param {Settings_SaveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_save = /** @type {((inputs?: Settings_SaveInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_SaveInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.settings_save(inputs)
	if (locale === "en") return __en.settings_save(inputs)
	return __ru.settings_save(inputs)
});
/**
* | output |
* | --- |
* | "The API response cache was cleared - the change is visible immediately." |
*
* @param {Settings_Saved_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_saved_hint = /** @type {((inputs?: Settings_Saved_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Saved_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.settings_saved_hint(inputs)
	if (locale === "en") return __en.settings_saved_hint(inputs)
	return __ru.settings_saved_hint(inputs)
});
/**
* | output |
* | --- |
* | "Nothing changed" |
*
* @param {Settings_UnchangedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_unchanged = /** @type {((inputs?: Settings_UnchangedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_UnchangedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.settings_unchanged(inputs)
	if (locale === "en") return __en.settings_unchanged(inputs)
	return __ru.settings_unchanged(inputs)
});
/**
* | output |
* | --- |
* | "Last changed {date} by {who}" |
*
* @param {Settings_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_updated = /** @type {((inputs: Settings_UpdatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_UpdatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.settings_updated(inputs)
	if (locale === "en") return __en.settings_updated(inputs)
	return __ru.settings_updated(inputs)
});
/**
* | output |
* | --- |
* | "the system" |
*
* @param {Settings_Updated_By_SystemInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_updated_by_system = /** @type {((inputs?: Settings_Updated_By_SystemInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Updated_By_SystemInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.settings_updated_by_system(inputs)
	if (locale === "en") return __en.settings_updated_by_system(inputs)
	return __ru.settings_updated_by_system(inputs)
});
/**
* | output |
* | --- |
* | "Source address" |
*
* @param {Source_Base_UrlInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_base_url = /** @type {((inputs?: Source_Base_UrlInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Base_UrlInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_base_url(inputs)
	if (locale === "en") return __en.source_base_url(inputs)
	return __ru.source_base_url(inputs)
});
/**
* | output |
* | --- |
* | "Base URL for an API source, watched directory for a CSV one." |
*
* @param {Source_Base_Url_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_base_url_hint = /** @type {((inputs?: Source_Base_Url_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Base_Url_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_base_url_hint(inputs)
	if (locale === "en") return __en.source_base_url_hint(inputs)
	return __ru.source_base_url_hint(inputs)
});
/**
* | output |
* | --- |
* | "Cursor" |
*
* @param {Source_CursorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor = /** @type {((inputs?: Source_CursorInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_CursorInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_cursor(inputs)
	if (locale === "en") return __en.source_cursor(inputs)
	return __ru.source_cursor(inputs)
});
/**
* | output |
* | --- |
* | "not set" |
*
* @param {Source_Cursor_AbsentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor_absent = /** @type {((inputs?: Source_Cursor_AbsentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Cursor_AbsentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_cursor_absent(inputs)
	if (locale === "en") return __en.source_cursor_absent(inputs)
	return __ru.source_cursor_absent(inputs)
});
/**
* | output |
* | --- |
* | "set" |
*
* @param {Source_Cursor_PresentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor_present = /** @type {((inputs?: Source_Cursor_PresentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Cursor_PresentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_cursor_present(inputs)
	if (locale === "en") return __en.source_cursor_present(inputs)
	return __ru.source_cursor_present(inputs)
});
/**
* | output |
* | --- |
* | "Disable" |
*
* @param {Source_DisableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_disable = /** @type {((inputs?: Source_DisableInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_DisableInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_disable(inputs)
	if (locale === "en") return __en.source_disable(inputs)
	return __ru.source_disable(inputs)
});
/**
* | output |
* | --- |
* | "Enable" |
*
* @param {Source_EnableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enable = /** @type {((inputs?: Source_EnableInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_EnableInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_enable(inputs)
	if (locale === "en") return __en.source_enable(inputs)
	return __ru.source_enable(inputs)
});
/**
* | output |
* | --- |
* | "State" |
*
* @param {Source_EnabledInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enabled = /** @type {((inputs?: Source_EnabledInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_EnabledInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_enabled(inputs)
	if (locale === "en") return __en.source_enabled(inputs)
	return __ru.source_enabled(inputs)
});
/**
* | output |
* | --- |
* | "Disabled" |
*
* @param {Source_Enabled_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enabled_no = /** @type {((inputs?: Source_Enabled_NoInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Enabled_NoInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_enabled_no(inputs)
	if (locale === "en") return __en.source_enabled_no(inputs)
	return __ru.source_enabled_no(inputs)
});
/**
* | output |
* | --- |
* | "Enabled" |
*
* @param {Source_Enabled_YesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enabled_yes = /** @type {((inputs?: Source_Enabled_YesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Enabled_YesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_enabled_yes(inputs)
	if (locale === "en") return __en.source_enabled_yes(inputs)
	return __ru.source_enabled_yes(inputs)
});
/**
* | output |
* | --- |
* | "Kind" |
*
* @param {Source_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind = /** @type {((inputs?: Source_KindInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_KindInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_kind(inputs)
	if (locale === "en") return __en.source_kind(inputs)
	return __ru.source_kind(inputs)
});
/**
* | output |
* | --- |
* | "REST API" |
*
* @param {Source_Kind_ApiInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind_api = /** @type {((inputs?: Source_Kind_ApiInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Kind_ApiInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_kind_api(inputs)
	if (locale === "en") return __en.source_kind_api(inputs)
	return __ru.source_kind_api(inputs)
});
/**
* | output |
* | --- |
* | "CSV files" |
*
* @param {Source_Kind_CsvInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind_csv = /** @type {((inputs?: Source_Kind_CsvInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Kind_CsvInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_kind_csv(inputs)
	if (locale === "en") return __en.source_kind_csv(inputs)
	return __ru.source_kind_csv(inputs)
});
/**
* | output |
* | --- |
* | "No sources configured." |
*
* @param {Source_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_none = /** @type {((inputs?: Source_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_none(inputs)
	if (locale === "en") return __en.source_none(inputs)
	return __ru.source_none(inputs)
});
/**
* | output |
* | --- |
* | "Run import" |
*
* @param {Source_RunInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_run = /** @type {((inputs?: Source_RunInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_RunInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_run(inputs)
	if (locale === "en") return __en.source_run(inputs)
	return __ru.source_run(inputs)
});
/**
* | output |
* | --- |
* | "The run has started - watch the import journal." |
*
* @param {Source_Run_StartedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_run_started = /** @type {((inputs?: Source_Run_StartedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Run_StartedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_run_started(inputs)
	if (locale === "en") return __en.source_run_started(inputs)
	return __ru.source_run_started(inputs)
});
/**
* | output |
* | --- |
* | "Schedule" |
*
* @param {Source_ScheduleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_schedule = /** @type {((inputs?: Source_ScheduleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_ScheduleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_schedule(inputs)
	if (locale === "en") return __en.source_schedule(inputs)
	return __ru.source_schedule(inputs)
});
/**
* | output |
* | --- |
* | "Cron expression; empty means manual runs only." |
*
* @param {Source_Schedule_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_schedule_hint = /** @type {((inputs?: Source_Schedule_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Schedule_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.source_schedule_hint(inputs)
	if (locale === "en") return __en.source_schedule_hint(inputs)
	return __ru.source_schedule_hint(inputs)
});
/**
* | output |
* | --- |
* | "Reviewer e-mail" |
*
* @param {Staff_Unit_EmailInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_email = /** @type {((inputs?: Staff_Unit_EmailInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_EmailInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.staff_unit_email(inputs)
	if (locale === "en") return __en.staff_unit_email(inputs)
	return __ru.staff_unit_email(inputs)
});
/**
* | output |
* | --- |
* | "The address is neither stored nor logged: the server keeps only an irreversible hash and a mask." |
*
* @param {Staff_Unit_Email_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_email_hint = /** @type {((inputs?: Staff_Unit_Email_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_Email_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.staff_unit_email_hint(inputs)
	if (locale === "en") return __en.staff_unit_email_hint(inputs)
	return __ru.staff_unit_email_hint(inputs)
});
/**
* | output |
* | --- |
* | "Masked address" |
*
* @param {Staff_Unit_MaskedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_masked = /** @type {((inputs?: Staff_Unit_MaskedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_MaskedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.staff_unit_masked(inputs)
	if (locale === "en") return __en.staff_unit_masked(inputs)
	return __ru.staff_unit_masked(inputs)
});
/**
* | output |
* | --- |
* | "No mappings defined." |
*
* @param {Staff_Unit_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_none = /** @type {((inputs?: Staff_Unit_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.staff_unit_none(inputs)
	if (locale === "en") return __en.staff_unit_none(inputs)
	return __ru.staff_unit_none(inputs)
});
/**
* | output |
* | --- |
* | "Updated" |
*
* @param {Staff_Unit_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_updated = /** @type {((inputs?: Staff_Unit_UpdatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_UpdatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.staff_unit_updated(inputs)
	if (locale === "en") return __en.staff_unit_updated(inputs)
	return __ru.staff_unit_updated(inputs)
});
/**
* | output |
* | --- |
* | "Ties a reviewer to a faculty and department; the unit breakdown is built on it." |
*
* @param {Staff_Units_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_units_hint = /** @type {((inputs?: Staff_Units_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Units_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.staff_units_hint(inputs)
	if (locale === "en") return __en.staff_units_hint(inputs)
	return __ru.staff_units_hint(inputs)
});
/**
* | output |
* | --- |
* | "Reviewers and units" |
*
* @param {Staff_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_units_title = /** @type {((inputs?: Staff_Units_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Units_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.staff_units_title(inputs)
	if (locale === "en") return __en.staff_units_title(inputs)
	return __ru.staff_units_title(inputs)
});
/**
* | output |
* | --- |
* | "Accepted" |
*
* @param {Status_AcceptedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_accepted = /** @type {((inputs?: Status_AcceptedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Status_AcceptedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.status_accepted(inputs)
	if (locale === "en") return __en.status_accepted(inputs)
	return __ru.status_accepted(inputs)
});
/**
* | output |
* | --- |
* | "Needs revision" |
*
* @param {Status_Needs_RevisionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_needs_revision = /** @type {((inputs?: Status_Needs_RevisionInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Status_Needs_RevisionInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.status_needs_revision(inputs)
	if (locale === "en") return __en.status_needs_revision(inputs)
	return __ru.status_needs_revision(inputs)
});
/**
* | output |
* | --- |
* | "Recheck" |
*
* @param {Status_RecheckInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_recheck = /** @type {((inputs?: Status_RecheckInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Status_RecheckInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.status_recheck(inputs)
	if (locale === "en") return __en.status_recheck(inputs)
	return __ru.status_recheck(inputs)
});
/**
* | output |
* | --- |
* | "Rejected" |
*
* @param {Status_RejectedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_rejected = /** @type {((inputs?: Status_RejectedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Status_RejectedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.status_rejected(inputs)
	if (locale === "en") return __en.status_rejected(inputs)
	return __ru.status_rejected(inputs)
});
/**
* | output |
* | --- |
* | "Actions" |
*
* @param {Table_ActionsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const table_actions = /** @type {((inputs?: Table_ActionsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_ActionsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.table_actions(inputs)
	if (locale === "en") return __en.table_actions(inputs)
	return __ru.table_actions(inputs)
});
/**
* | output |
* | --- |
* | "The breakdown by unit follows the current reviewer-to-unit mapping; for past academic years it is approximate." |
*
* @param {Units_Coverage_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_coverage_footnote = /** @type {((inputs?: Units_Coverage_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Coverage_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.units_coverage_footnote(inputs)
	if (locale === "en") return __en.units_coverage_footnote(inputs)
	return __ru.units_coverage_footnote(inputs)
});
/**
* | output |
* | --- |
* | "A faculty total includes departments whose own cells are suppressed, so the visible rows need not add up to it." |
*
* @param {Units_Margin_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_margin_footnote = /** @type {((inputs?: Units_Margin_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Margin_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.units_margin_footnote(inputs)
	if (locale === "en") return __en.units_margin_footnote(inputs)
	return __ru.units_margin_footnote(inputs)
});
/**
* | output |
* | --- |
* | "No breakdown: your scope is a single unit, and its figures are above." |
*
* @param {Units_Own_Scope_OnlyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_own_scope_only = /** @type {((inputs?: Units_Own_Scope_OnlyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Own_Scope_OnlyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.units_own_scope_only(inputs)
	if (locale === "en") return __en.units_own_scope_only(inputs)
	return __ru.units_own_scope_only(inputs)
});
/**
* | output |
* | --- |
* | "The breakdown by unit becomes available once the mapping of reviewers to units has been loaded." |
*
* @param {Units_Pending_Mapping_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_pending_mapping_footnote = /** @type {((inputs?: Units_Pending_Mapping_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Pending_Mapping_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.units_pending_mapping_footnote(inputs)
	if (locale === "en") return __en.units_pending_mapping_footnote(inputs)
	return __ru.units_pending_mapping_footnote(inputs)
});
/**
* | output |
* | --- |
* | "A breakdown by study programme is not available yet." |
*
* @param {Units_Program_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_program_footnote = /** @type {((inputs?: Units_Program_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Program_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.units_program_footnote(inputs)
	if (locale === "en") return __en.units_program_footnote(inputs)
	return __ru.units_program_footnote(inputs)
});
/**
* | output |
* | --- |
* | "«Unassigned» covers checks whose reviewing unit could not be resolved." |
*
* @param {Units_Unassigned_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_unassigned_footnote = /** @type {((inputs?: Units_Unassigned_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Unassigned_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.units_unassigned_footnote(inputs)
	if (locale === "en") return __en.units_unassigned_footnote(inputs)
	return __ru.units_unassigned_footnote(inputs)
});
/**
* | output |
* | --- |
* | "Average check duration" |
*
* @param {Usage_Avg_DurationInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_avg_duration = /** @type {((inputs?: Usage_Avg_DurationInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Usage_Avg_DurationInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.usage_avg_duration(inputs)
	if (locale === "en") return __en.usage_avg_duration(inputs)
	return __ru.usage_avg_duration(inputs)
});
/**
* | output |
* | --- |
* | "Entered by hand by the compliance office; the source export does not carry it." |
*
* @param {Usage_Avg_Duration_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_avg_duration_hint = /** @type {((inputs?: Usage_Avg_Duration_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Usage_Avg_Duration_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.usage_avg_duration_hint(inputs)
	if (locale === "en") return __en.usage_avg_duration_hint(inputs)
	return __ru.usage_avg_duration_hint(inputs)
});
/**
* | output |
* | --- |
* | "no data" |
*
* @param {Usage_No_DataInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_no_data = /** @type {((inputs?: Usage_No_DataInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Usage_No_DataInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.usage_no_data(inputs)
	if (locale === "en") return __en.usage_no_data(inputs)
	return __ru.usage_no_data(inputs)
});
/**
* | output |
* | --- |
* | "{value} s" |
*
* @param {Usage_SecondsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_seconds = /** @type {((inputs: Usage_SecondsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Usage_SecondsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.usage_seconds(inputs)
	if (locale === "en") return __en.usage_seconds(inputs)
	return __ru.usage_seconds(inputs)
});
/**
* | output |
* | --- |
* | "Derive the work type from the document title." |
*
* @param {Work_Type_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_type_rules_hint = /** @type {((inputs?: Work_Type_Rules_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Work_Type_Rules_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.work_type_rules_hint(inputs)
	if (locale === "en") return __en.work_type_rules_hint(inputs)
	return __ru.work_type_rules_hint(inputs)
});
/**
* | output |
* | --- |
* | "Work-type rules" |
*
* @param {Work_Type_Rules_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_type_rules_title = /** @type {((inputs?: Work_Type_Rules_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Work_Type_Rules_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.work_type_rules_title(inputs)
	if (locale === "en") return __en.work_type_rules_title(inputs)
	return __ru.work_type_rules_title(inputs)
});
/**
* | output |
* | --- |
* | "No breakdown by work type is available: the source export carries no work-type field, and fewer than one per cent of checks can be classified from the docume..." |
*
* @param {Work_Types_Single_BucketInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_types_single_bucket = /** @type {((inputs?: Work_Types_Single_BucketInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Work_Types_Single_BucketInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return __kk.work_types_single_bucket(inputs)
	if (locale === "en") return __en.work_types_single_bucket(inputs)
	return __ru.work_types_single_bucket(inputs)
});