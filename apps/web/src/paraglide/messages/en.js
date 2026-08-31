/* eslint-disable */
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


export const action_add = /** @type {(inputs: Action_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add`)
};

export const action_delete = /** @type {(inputs: Action_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete`)
};

export const action_save = /** @type {(inputs: Action_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save`)
};

export const admin_audit = /** @type {(inputs: Admin_AuditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Access log`)
};

export const admin_audit_hint = /** @type {(inputs: Admin_Audit_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every access to the internal contour: who, when, which section, and with which filters.`)
};

export const admin_batch_rows = /** @type {(inputs: Admin_Batch_RowsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Read: ${i?.read} · upserted: ${i?.upserted} · rejected: ${i?.rejected}`)
};

export const admin_batch_stale = /** @type {(inputs: Admin_Batch_StaleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No refresh for ${i?.hours} h`)
};

export const admin_counts = /** @type {(inputs: Admin_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionaries and sources`)
};

export const admin_counts_hint = /** @type {(inputs: Admin_Counts_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What the system currently holds.`)
};

export const admin_dictionaries = /** @type {(inputs: Admin_DictionariesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionaries`)
};

export const admin_last_batch = /** @type {(inputs: Admin_Last_BatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last import`)
};

export const admin_last_batch_hint = /** @type {(inputs: Admin_Last_Batch_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The internal contour refreshes at least once a day.`)
};

export const admin_nav_areas = /** @type {(inputs: Admin_Nav_AreasInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Administration areas`)
};

export const admin_overview = /** @type {(inputs: Admin_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Overview`)
};

export const admin_quick_links = /** @type {(inputs: Admin_Quick_LinksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quick links`)
};

export const admin_reports = /** @type {(inputs: Admin_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reports`)
};

export const admin_reports_hint = /** @type {(inputs: Admin_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Immutable report snapshots. Publishing puts the file on the public contour.`)
};

export const admin_reports_unpublished = /** @type {(inputs: Admin_Reports_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unpublished reports`)
};

export const admin_roles = /** @type {(inputs: Admin_RolesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Roles and access`)
};

export const admin_roles_hint = /** @type {(inputs: Admin_Roles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accounts and the roles and scopes granted to them.`)
};

export const admin_settings = /** @type {(inputs: Admin_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings`)
};

export const admin_settings_hint = /** @type {(inputs: Admin_Settings_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Thresholds, semester boundaries and derivation rules. A change reaches the API immediately.`)
};

export const admin_sources = /** @type {(inputs: Admin_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Data sources`)
};

export const admin_sources_hint = /** @type {(inputs: Admin_Sources_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ingest sources and refresh schedules; manual import runs.`)
};

export const admin_title = /** @type {(inputs: Admin_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Administration`)
};

export const alias_kind = /** @type {(inputs: Alias_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionary kind`)
};

export const alias_none = /** @type {(inputs: Alias_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No aliases defined.`)
};

export const alias_source_label = /** @type {(inputs: Alias_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Label in the source`)
};

export const alias_target = /** @type {(inputs: Alias_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionary entry`)
};

export const alias_target_code = /** @type {(inputs: Alias_Target_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Target code`)
};

export const aliases_hint = /** @type {(inputs: Aliases_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maps the source system's labels onto the dashboard dictionaries.`)
};

export const aliases_title = /** @type {(inputs: Aliases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Label aliases`)
};

export const app_error_body = /** @type {(inputs: App_Error_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try reloading the page. If the error persists, contact the system administrator.`)
};

export const app_error_home = /** @type {(inputs: App_Error_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Go to the dashboard`)
};

export const app_error_title = /** @type {(inputs: App_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The page could not be loaded`)
};

export const app_title = /** @type {(inputs: App_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Antiplagiarism Dashboard`)
};

export const app_title_full = /** @type {(inputs: App_Title_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Antiplagiarism Dashboard - Toraighyrov University`)
};

export const audit_action = /** @type {(inputs: Audit_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Action`)
};

export const audit_action_admin_change = /** @type {(inputs: Audit_Action_Admin_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Admin change`)
};

export const audit_action_export_pdf = /** @type {(inputs: Audit_Action_Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF export`)
};

export const audit_action_export_xlsx = /** @type {(inputs: Audit_Action_Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Excel export`)
};

export const audit_action_view = /** @type {(inputs: Audit_Action_ViewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`View`)
};

export const audit_any = /** @type {(inputs: Audit_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Any`)
};

export const audit_filters = /** @type {(inputs: Audit_FiltersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filters`)
};

export const audit_footer = /** @type {(inputs: Audit_FooterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.total} entries. Retention is at least ${i?.days} days; there is no deletion path.`)
};

export const audit_ip = /** @type {(inputs: Audit_IpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IP address`)
};

export const audit_none = /** @type {(inputs: Audit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No entries match these filters.`)
};

export const audit_role = /** @type {(inputs: Audit_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Role`)
};

export const audit_section = /** @type {(inputs: Audit_SectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Section`)
};

export const audit_time = /** @type {(inputs: Audit_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time`)
};

export const audit_user = /** @type {(inputs: Audit_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`User`)
};

export const batch_errors_empty = /** @type {(inputs: Batch_Errors_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No rejected rows.`)
};

export const batch_errors_hide = /** @type {(inputs: Batch_Errors_HideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hide errors`)
};

export const batch_errors_show = /** @type {(inputs: Batch_Errors_ShowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Errors`)
};

export const batch_errors_title = /** @type {(inputs: Batch_Errors_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Rejected rows of batch #${i?.id}`)
};

export const batch_rows_read = /** @type {(inputs: Batch_Rows_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read`)
};

export const batch_rows_rejected = /** @type {(inputs: Batch_Rows_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected`)
};

export const batch_rows_skipped = /** @type {(inputs: Batch_Rows_SkippedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skipped`)
};

export const batch_rows_upserted = /** @type {(inputs: Batch_Rows_UpsertedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Upserted`)
};

export const batch_source = /** @type {(inputs: Batch_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source`)
};

export const batch_started = /** @type {(inputs: Batch_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Started`)
};

export const batch_status = /** @type {(inputs: Batch_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status`)
};

export const batch_status_failed = /** @type {(inputs: Batch_Status_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Failed`)
};

export const batch_status_running = /** @type {(inputs: Batch_Status_RunningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Running`)
};

export const batch_status_succeeded = /** @type {(inputs: Batch_Status_SucceededInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Succeeded`)
};

export const batches_empty = /** @type {(inputs: Batches_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No imports yet.`)
};

export const batches_hint = /** @type {(inputs: Batches_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every run is journalled: time, source, row counts, validation errors.`)
};

export const batches_title = /** @type {(inputs: Batches_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import journal`)
};

export const brand_lockup = /** @type {(inputs: Brand_LockupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toraighyrov University`)
};

export const chart_axis_academic_year = /** @type {(inputs: Chart_Axis_Academic_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic year`)
};

export const chart_axis_active_reviewers = /** @type {(inputs: Chart_Axis_Active_ReviewersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active reviewers`)
};

export const chart_axis_category = /** @type {(inputs: Chart_Axis_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Category`)
};

export const chart_axis_count = /** @type {(inputs: Chart_Axis_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Number of checks`)
};

export const chart_axis_faculty = /** @type {(inputs: Chart_Axis_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faculty`)
};

export const chart_axis_month = /** @type {(inputs: Chart_Axis_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Month`)
};

export const chart_axis_originality = /** @type {(inputs: Chart_Axis_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality, %`)
};

export const chart_axis_share = /** @type {(inputs: Chart_Axis_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Share of total, %`)
};

export const chart_axis_value = /** @type {(inputs: Chart_Axis_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value`)
};

export const chart_axis_work_type = /** @type {(inputs: Chart_Axis_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work type`)
};

export const chart_bucket_50_70 = /** @type {(inputs: Chart_Bucket_50_70Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`50–70%`)
};

export const chart_bucket_70_85 = /** @type {(inputs: Chart_Bucket_70_85Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`70–85%`)
};

export const chart_bucket_85_95 = /** @type {(inputs: Chart_Bucket_85_95Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`85–95%`)
};

export const chart_bucket_gte_95 = /** @type {(inputs: Chart_Bucket_Gte_95Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`95% and above`)
};

export const chart_bucket_lt_50 = /** @type {(inputs: Chart_Bucket_Lt_50Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`below 50%`)
};

export const chart_data_table = /** @type {(inputs: Chart_Data_TableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Data table`)
};

export const chart_dynamics_flags_title = /** @type {(inputs: Chart_Dynamics_Flags_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations and rechecks by month`)
};

export const chart_dynamics_title = /** @type {(inputs: Chart_Dynamics_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks and average originality by month`)
};

export const chart_empty = /** @type {(inputs: Chart_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No data for the selected filters`)
};

export const chart_faculties_title = /** @type {(inputs: Chart_Faculties_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Figures by faculty`)
};

export const chart_heatmap_scale = /** @type {(inputs: Chart_Heatmap_ScaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Colour scale: from the lowest to the highest value in the column`)
};

export const chart_heatmap_unit = /** @type {(inputs: Chart_Heatmap_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit`)
};

export const chart_histogram_bucket = /** @type {(inputs: Chart_Histogram_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality range`)
};

export const chart_histogram_title = /** @type {(inputs: Chart_Histogram_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks by originality band`)
};

export const chart_kpi_delta_down = /** @type {(inputs: Chart_Kpi_Delta_DownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`down by ${i?.delta}`)
};

export const chart_kpi_delta_flat = /** @type {(inputs: Chart_Kpi_Delta_FlatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no change`)
};

export const chart_kpi_delta_up = /** @type {(inputs: Chart_Kpi_Delta_UpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`up by ${i?.delta}`)
};

export const chart_kpi_previous = /** @type {(inputs: Chart_Kpi_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`vs previous period`)
};

export const chart_kpi_sparkline = /** @type {(inputs: Chart_Kpi_SparklineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trend over the period`)
};

export const chart_legend = /** @type {(inputs: Chart_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Legend`)
};

export const chart_semester_autumn = /** @type {(inputs: Chart_Semester_AutumnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Autumn semester ${i?.year}`)
};

export const chart_semester_bands = /** @type {(inputs: Chart_Semester_BandsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Semester boundaries`)
};

export const chart_semester_shading = /** @type {(inputs: Chart_Semester_ShadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shading marks the autumn semester`)
};

export const chart_semester_spring = /** @type {(inputs: Chart_Semester_SpringInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Spring semester ${i?.year}`)
};

export const chart_series_active_reviewers = /** @type {(inputs: Chart_Series_Active_ReviewersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active reviewers`)
};

export const chart_series_checks = /** @type {(inputs: Chart_Series_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks`)
};

export const chart_series_escalated = /** @type {(inputs: Chart_Series_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations`)
};

export const chart_series_originality = /** @type {(inputs: Chart_Series_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average originality`)
};

export const chart_series_rechecks = /** @type {(inputs: Chart_Series_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechecks`)
};

export const chart_suppressed_note = /** @type {(inputs: Chart_Suppressed_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} of ${i?.total} values are hidden: insufficient data`)
};

export const chart_units_title = /** @type {(inputs: Chart_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Metrics by faculty and department`)
};

export const chart_usage_title = /** @type {(inputs: Chart_Usage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active reviewers by month`)
};

export const chart_work_types_counts = /** @type {(inputs: Chart_Work_Types_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks by work type`)
};

export const chart_work_types_originality = /** @type {(inputs: Chart_Work_Types_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality by work type`)
};

export const confirm_delete = /** @type {(inputs: Confirm_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this entry? This cannot be undone.`)
};

export const confirm_revoke_role = /** @type {(inputs: Confirm_Revoke_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revoke this role from the account?`)
};

export const confirm_unpublish_report = /** @type {(inputs: Confirm_Unpublish_ReportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unpublish this report? It will no longer be available on the public dashboard.`)
};

export const dict_active = /** @type {(inputs: Dict_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

export const dict_active_no = /** @type {(inputs: Dict_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No`)
};

export const dict_active_yes = /** @type {(inputs: Dict_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yes`)
};

export const dict_code = /** @type {(inputs: Dict_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Code`)
};

export const dict_code_hint = /** @type {(inputs: Dict_Code_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unique code of the dictionary entry.`)
};

export const dict_entries = /** @type {(inputs: Dict_EntriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionary entries`)
};

export const dict_entries_hint = /** @type {(inputs: Dict_Entries_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adding an existing code replaces the entry.`)
};

export const dict_name_en = /** @type {(inputs: Dict_Name_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name (EN)`)
};

export const dict_name_kk = /** @type {(inputs: Dict_Name_KkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name (KK)`)
};

export const dict_name_ru = /** @type {(inputs: Dict_Name_RuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name (RU)`)
};

export const dict_none = /** @type {(inputs: Dict_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The dictionary is empty.`)
};

export const dict_parent = /** @type {(inputs: Dict_ParentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Parent unit`)
};

export const dict_parent_none = /** @type {(inputs: Dict_Parent_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not selected`)
};

export const dict_sort_order = /** @type {(inputs: Dict_Sort_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sort order`)
};

export const dict_tab_departments = /** @type {(inputs: Dict_Tab_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Departments`)
};

export const dict_tab_faculties = /** @type {(inputs: Dict_Tab_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faculties`)
};

export const dict_tab_programs = /** @type {(inputs: Dict_Tab_ProgramsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Programmes`)
};

export const dict_tab_work_types = /** @type {(inputs: Dict_Tab_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work types`)
};

export const embed_title = /** @type {(inputs: Embed_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic integrity - widget`)
};

export const error_out_of_scope = /** @type {(inputs: Error_Out_Of_ScopeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The selected unit is outside your area of visibility. Change the filter or contact an administrator.`)
};

export const error_role_denied = /** @type {(inputs: Error_Role_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your role does not grant access to this section. Contact the system administrator.`)
};

export const error_session_expired = /** @type {(inputs: Error_Session_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The session has ended. Sign in again.`)
};

export const escalations_units_note = /** @type {(inputs: Escalations_Units_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The per-unit breakdown is always k-screened, whatever the role.`)
};

export const escalations_units_title = /** @type {(inputs: Escalations_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations by unit`)
};

export const ethics_cases_empty = /** @type {(inputs: Ethics_Cases_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The Ethics Council register is empty for this period.`)
};

export const ethics_cases_title = /** @type {(inputs: Ethics_Cases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ethics Council register`)
};

export const ethics_category = /** @type {(inputs: Ethics_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Violation category`)
};

export const ethics_closed = /** @type {(inputs: Ethics_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Closed`)
};

export const ethics_referred = /** @type {(inputs: Ethics_ReferredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Referred`)
};

export const ethics_year = /** @type {(inputs: Ethics_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic year`)
};

export const export_busy = /** @type {(inputs: Export_BusyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preparing…`)
};

export const export_error = /** @type {(inputs: Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The file could not be generated.`)
};

export const export_official_use = /** @type {(inputs: Export_Official_UseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`For official use only. The export is journalled.`)
};

export const export_pdf = /** @type {(inputs: Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export PDF`)
};

export const export_public_hint = /** @type {(inputs: Export_Public_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The file contains the figures for the selected period with the current filters applied.`)
};

export const export_title = /** @type {(inputs: Export_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Data export`)
};

export const export_xlsx = /** @type {(inputs: Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export Excel`)
};

export const filter_all_departments = /** @type {(inputs: Filter_All_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All departments`)
};

export const filter_all_faculties = /** @type {(inputs: Filter_All_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All faculties`)
};

export const filter_all_statuses = /** @type {(inputs: Filter_All_StatusesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All statuses`)
};

export const filter_all_work_types = /** @type {(inputs: Filter_All_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All work types`)
};

export const filter_bar_title = /** @type {(inputs: Filter_Bar_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filters`)
};

export const filter_department = /** @type {(inputs: Filter_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Department`)
};

export const filter_faculty = /** @type {(inputs: Filter_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faculty`)
};

export const filter_from = /** @type {(inputs: Filter_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start date`)
};

export const filter_period = /** @type {(inputs: Filter_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period`)
};

export const filter_period_3y = /** @type {(inputs: Filter_Period_3yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`3 years`)
};

export const filter_period_5y = /** @type {(inputs: Filter_Period_5yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`5 years`)
};

export const filter_period_custom = /** @type {(inputs: Filter_Period_CustomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Custom`)
};

export const filter_period_month = /** @type {(inputs: Filter_Period_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Month`)
};

export const filter_period_semester = /** @type {(inputs: Filter_Period_SemesterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Semester`)
};

export const filter_period_shown = /** @type {(inputs: Filter_Period_ShownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Showing ${i?.from} - ${i?.to}`)
};

export const filter_period_year = /** @type {(inputs: Filter_Period_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic year`)
};

export const filter_program = /** @type {(inputs: Filter_ProgramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Study program`)
};

export const filter_program_hint = /** @type {(inputs: Filter_Program_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter the study-programme code - picking from a list is not available yet.`)
};

export const filter_program_placeholder = /** @type {(inputs: Filter_Program_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PROG01`)
};

export const filter_reset = /** @type {(inputs: Filter_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reset filters`)
};

export const filter_status = /** @type {(inputs: Filter_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check status`)
};

export const filter_to = /** @type {(inputs: Filter_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`End date`)
};

export const filter_work_type = /** @type {(inputs: Filter_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work type`)
};

export const footer_about_body = /** @type {(inputs: Footer_About_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This dashboard publishes anonymized statistics on originality checks of written work at Toraighyrov University. Figures are aggregated - by university, faculty and work type; no data about individual authors or works is published.`)
};

export const footer_about_title = /** @type {(inputs: Footer_About_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`About this dashboard`)
};

export const footer_sections_title = /** @type {(inputs: Footer_Sections_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sections`)
};

export const footer_staff_link = /** @type {(inputs: Footer_Staff_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Staff sign-in`)
};

export const footer_updated = /** @type {(inputs: Footer_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The data is refreshed at least once a day.`)
};

export const form_error = /** @type {(inputs: Form_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not save`)
};

export const form_invalid_email = /** @type {(inputs: Form_Invalid_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a valid e-mail address`)
};

export const form_invalid_json = /** @type {(inputs: Form_Invalid_JsonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Malformed JSON, or the structure does not match`)
};

export const form_invalid_number = /** @type {(inputs: Form_Invalid_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a non-negative whole number`)
};

export const form_required = /** @type {(inputs: Form_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Required`)
};

export const form_saved = /** @type {(inputs: Form_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved`)
};

export const form_saving = /** @type {(inputs: Form_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saving…`)
};

export const header_locale_label = /** @type {(inputs: Header_Locale_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Interface language`)
};

export const header_skip_link = /** @type {(inputs: Header_Skip_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skip to content`)
};

export const initiator_other = /** @type {(inputs: Initiator_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other`)
};

export const initiator_registrar = /** @type {(inputs: Initiator_RegistrarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registrar's office`)
};

export const initiator_rules_hint = /** @type {(inputs: Initiator_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Derive the initiator role from the reviewer's address.`)
};

export const initiator_rules_title = /** @type {(inputs: Initiator_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Initiator rules`)
};

export const initiator_staff_self = /** @type {(inputs: Initiator_Staff_SelfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Teaching staff (self-check)`)
};

export const initiator_student = /** @type {(inputs: Initiator_StudentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Student`)
};

export const insufficient_data = /** @type {(inputs: Insufficient_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`insufficient data`)
};

export const internal_contour_title = /** @type {(inputs: Internal_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Internal Antiplagiarism Analytics`)
};

export const internal_nav_other = /** @type {(inputs: Internal_Nav_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other`)
};

export const internal_nav_public = /** @type {(inputs: Internal_Nav_PublicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Public contour`)
};

export const internal_nav_sections = /** @type {(inputs: Internal_Nav_SectionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sections`)
};

export const internal_nav_toggle = /** @type {(inputs: Internal_Nav_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show or hide the menu`)
};

export const internal_overview_hint = /** @type {(inputs: Internal_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Metrics within your area of visibility.`)
};

export const k_threshold_note = /** @type {(inputs: K_Threshold_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Groups smaller than ${i?.k} checks are not published - the value is replaced by «insufficient data».`)
};

export const kpi_avg_originality = /** @type {(inputs: Kpi_Avg_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average originality`)
};

export const kpi_avg_originality_hint = /** @type {(inputs: Kpi_Avg_Originality_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mean across every check in the period`)
};

export const kpi_below_threshold = /** @type {(inputs: Kpi_Below_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Share below the threshold`)
};

export const kpi_below_threshold_hint = /** @type {(inputs: Kpi_Below_Threshold_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Checks below the threshold: ${i?.count}`)
};

export const kpi_coverage = /** @type {(inputs: Kpi_CoverageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check coverage`)
};

export const kpi_coverage_hint = /** @type {(inputs: Kpi_Coverage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Share of submitted works that were checked`)
};

export const kpi_escalated = /** @type {(inputs: Kpi_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations`)
};

export const kpi_escalated_hint = /** @type {(inputs: Kpi_Escalated_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suspicious works whose flag has not been cleared`)
};

export const kpi_escalated_share = /** @type {(inputs: Kpi_Escalated_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalation share`)
};

export const kpi_escalated_share_hint = /** @type {(inputs: Kpi_Escalated_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Of the period's checks`)
};

export const kpi_improved = /** @type {(inputs: Kpi_ImprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Improved`)
};

export const kpi_improved_share = /** @type {(inputs: Kpi_Improved_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Improved share`)
};

export const kpi_improved_share_hint = /** @type {(inputs: Kpi_Improved_Share_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Works improved: ${i?.count}`)
};

export const kpi_recheck_share = /** @type {(inputs: Kpi_Recheck_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recheck share`)
};

export const kpi_recheck_share_hint = /** @type {(inputs: Kpi_Recheck_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Of all works`)
};

export const kpi_total_checks = /** @type {(inputs: Kpi_Total_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total checks`)
};

export const kpi_total_checks_hint = /** @type {(inputs: Kpi_Total_Checks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`For the selected period`)
};

export const kpi_works_rechecked = /** @type {(inputs: Kpi_Works_RecheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechecked`)
};

export const kpi_works_rechecked_hint = /** @type {(inputs: Kpi_Works_Rechecked_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Works with more than one attempt`)
};

export const kpi_works_total = /** @type {(inputs: Kpi_Works_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Works in total`)
};

export const kpi_works_total_hint = /** @type {(inputs: Kpi_Works_Total_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Distinct works in the period`)
};

export const locale_name_en = /** @type {(inputs: Locale_Name_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`English`)
};

export const locale_name_kk = /** @type {(inputs: Locale_Name_KkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қазақша`)
};

export const locale_name_ru = /** @type {(inputs: Locale_Name_RuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Русский`)
};

export const login_failed = /** @type {(inputs: Login_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The login name or password is not correct.`)
};

export const login_hint = /** @type {(inputs: Login_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in with the account your system administrator created.`)
};

export const login_no_account = /** @type {(inputs: Login_No_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accounts are created by the system administrator. Ask them if you have no sign-in or have forgotten your password.`)
};

export const login_password = /** @type {(inputs: Login_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password`)
};

export const login_submit = /** @type {(inputs: Login_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in`)
};

export const login_throttled = /** @type {(inputs: Login_ThrottledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Too many sign-in attempts. Wait a moment and try again.`)
};

export const login_title = /** @type {(inputs: Login_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in to the internal contour`)
};

export const login_username = /** @type {(inputs: Login_UsernameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Login name`)
};

export const logout_button = /** @type {(inputs: Logout_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign out`)
};

export const not_found_title = /** @type {(inputs: Not_Found_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Page not found`)
};

export const public_contour_title = /** @type {(inputs: Public_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic Integrity - Open Statistics`)
};

export const rechecks_units_title = /** @type {(inputs: Rechecks_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechecks by unit`)
};

export const report_files = /** @type {(inputs: Report_FilesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Files`)
};

export const report_files_after_publish = /** @type {(inputs: Report_Files_After_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Available once published`)
};

export const report_generate = /** @type {(inputs: Report_GenerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Generate report`)
};

export const report_generate_hint = /** @type {(inputs: Report_Generate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The annual report runs 1 September – 31 August; a manual report takes any date range.`)
};

export const report_generated_at = /** @type {(inputs: Report_Generated_AtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Generated`)
};

export const report_generated_ok = /** @type {(inputs: Report_Generated_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The report has been generated`)
};

export const report_kind = /** @type {(inputs: Report_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Report kind`)
};

export const report_locale = /** @type {(inputs: Report_LocaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Report language`)
};

export const report_none = /** @type {(inputs: Report_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No reports have been generated yet.`)
};

export const report_period = /** @type {(inputs: Report_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period`)
};

export const report_publish = /** @type {(inputs: Report_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Publish`)
};

export const report_published = /** @type {(inputs: Report_PublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Published`)
};

export const report_published_state = /** @type {(inputs: Report_Published_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Publication`)
};

export const report_unpublish = /** @type {(inputs: Report_UnpublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unpublish`)
};

export const report_unpublished = /** @type {(inputs: Report_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not published`)
};

export const reports_download = /** @type {(inputs: Reports_DownloadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Download ${i?.format}`)
};

export const reports_empty = /** @type {(inputs: Reports_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No reports have been published yet.`)
};

export const reports_generated = /** @type {(inputs: Reports_GeneratedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Generated ${i?.date}`)
};

export const reports_kind_annual = /** @type {(inputs: Reports_Kind_AnnualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annual report`)
};

export const reports_kind_manual = /** @type {(inputs: Reports_Kind_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period report`)
};

export const request_access_account = /** @type {(inputs: Request_Access_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your account`)
};

export const request_access_back = /** @type {(inputs: Request_Access_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to the public statistics`)
};

export const request_access_body = /** @type {(inputs: Request_Access_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You are signed in, but your account has no rights to the internal contour. Access is granted on a request from the head of your unit, agreed with the system administrator.`)
};

export const request_access_staff_note = /** @type {(inputs: Request_Access_Staff_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The teaching-staff role covers the public contour. Unit-level detail needs a separate role.`)
};

export const request_access_step_admin = /** @type {(inputs: Request_Access_Step_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The system administrator grants the role and its scope - a faculty or a department.`)
};

export const request_access_step_head = /** @type {(inputs: Request_Access_Step_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The head of your unit submits an access request.`)
};

export const request_access_step_signin = /** @type {(inputs: Request_Access_Step_SigninInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in again once the role is granted, and the section opens.`)
};

export const request_access_title = /** @type {(inputs: Request_Access_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No access to the internal contour`)
};

export const role_admin = /** @type {(inputs: Role_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Administrator`)
};

export const role_compliance = /** @type {(inputs: Role_ComplianceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compliance office`)
};

export const role_dean = /** @type {(inputs: Role_DeanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dean`)
};

export const role_dept_head = /** @type {(inputs: Role_Dept_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Head of department`)
};

export const role_ethics = /** @type {(inputs: Role_EthicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ethics officer`)
};

export const role_none = /** @type {(inputs: Role_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No role`)
};

export const role_staff = /** @type {(inputs: Role_StaffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Teaching staff`)
};

export const roles_account = /** @type {(inputs: Roles_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account`)
};

export const roles_active = /** @type {(inputs: Roles_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`State`)
};

export const roles_active_no = /** @type {(inputs: Roles_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disabled`)
};

export const roles_active_yes = /** @type {(inputs: Roles_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

export const roles_grant = /** @type {(inputs: Roles_GrantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Grant a role`)
};

export const roles_grant_hint = /** @type {(inputs: Roles_Grant_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A dean needs a faculty code, a head of department a department code.`)
};

export const roles_grant_submit = /** @type {(inputs: Roles_Grant_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Grant`)
};

export const roles_grants = /** @type {(inputs: Roles_GrantsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Grants`)
};

export const roles_none = /** @type {(inputs: Roles_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No accounts.`)
};

export const roles_revoke = /** @type {(inputs: Roles_RevokeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revoke the role`)
};

export const roles_role = /** @type {(inputs: Roles_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Role`)
};

export const roles_scope_department = /** @type {(inputs: Roles_Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scope: department`)
};

export const roles_scope_department_required = /** @type {(inputs: Roles_Scope_Department_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Required for a head of department`)
};

export const roles_scope_faculty = /** @type {(inputs: Roles_Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scope: faculty`)
};

export const roles_scope_faculty_required = /** @type {(inputs: Roles_Scope_Faculty_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Required for a dean`)
};

export const roles_scope_none = /** @type {(inputs: Roles_Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unrestricted`)
};

export const roles_subject = /** @type {(inputs: Roles_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`SSO subject`)
};

export const rule_activate = /** @type {(inputs: Rule_ActivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable`)
};

export const rule_active = /** @type {(inputs: Rule_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

export const rule_deactivate = /** @type {(inputs: Rule_DeactivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disable`)
};

export const rule_initiator = /** @type {(inputs: Rule_InitiatorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Initiator`)
};

export const rule_none = /** @type {(inputs: Rule_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No rules defined.`)
};

export const rule_pattern = /** @type {(inputs: Rule_PatternInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pattern`)
};

export const rule_pattern_hint = /** @type {(inputs: Rule_Pattern_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Substring matched against the normalized work title.`)
};

export const rule_priority = /** @type {(inputs: Rule_PriorityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Priority`)
};

export const rule_priority_hint = /** @type {(inputs: Rule_Priority_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The lowest value wins.`)
};

export const rule_regex_hint = /** @type {(inputs: Rule_Regex_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regular expression over the normalized reviewer address.`)
};

export const rule_work_type = /** @type {(inputs: Rule_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work type`)
};

export const scope_all = /** @type {(inputs: Scope_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The whole university`)
};

export const scope_department = /** @type {(inputs: Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Within the department`)
};

export const scope_faculty = /** @type {(inputs: Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Within the faculty`)
};

export const scope_none = /** @type {(inputs: Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No scope`)
};

export const section_dynamics = /** @type {(inputs: Section_DynamicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trends over time`)
};

export const section_dynamics_hint = /** @type {(inputs: Section_Dynamics_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Number of checks and average originality by month.`)
};

export const section_error_title = /** @type {(inputs: Section_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This section could not be loaded`)
};

export const section_error_unavailable = /** @type {(inputs: Section_Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The service is temporarily unavailable.`)
};

export const section_escalations = /** @type {(inputs: Section_EscalationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations`)
};

export const section_escalations_hint = /** @type {(inputs: Section_Escalations_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aggregated counters of cases referred to the Ethics Council, with no personal data.`)
};

export const section_faculties = /** @type {(inputs: Section_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By faculty`)
};

export const section_faculties_hint = /** @type {(inputs: Section_Faculties_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aggregated figures per faculty and institute.`)
};

export const section_histogram = /** @type {(inputs: Section_HistogramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality distribution`)
};

export const section_histogram_hint = /** @type {(inputs: Section_Histogram_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How checks are distributed across the originality bands.`)
};

export const section_in_development = /** @type {(inputs: Section_In_DevelopmentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.section} - in development`)
};

export const section_loading = /** @type {(inputs: Section_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading data`)
};

export const section_overview = /** @type {(inputs: Section_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Overview`)
};

export const section_overview_hint = /** @type {(inputs: Section_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Headline figures for the selected period and the change against the same period a year earlier.`)
};

export const section_rechecks = /** @type {(inputs: Section_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechecks`)
};

export const section_rechecks_hint = /** @type {(inputs: Section_Rechecks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The share of works rechecked after revision, and how many of them improved.`)
};

export const section_reports = /** @type {(inputs: Section_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Published reports`)
};

export const section_reports_hint = /** @type {(inputs: Section_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annual and ad-hoc anonymized reports.`)
};

export const section_retry = /** @type {(inputs: Section_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retry`)
};

export const section_role_restricted = /** @type {(inputs: Section_Role_RestrictedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This section is available to the ethics council and the compliance service. If you need it for your work, contact the system administrator.`)
};

export const section_units = /** @type {(inputs: Section_UnitsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By faculty and department`)
};

export const section_units_hint = /** @type {(inputs: Section_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faculty metrics, expandable to departments.`)
};

export const section_usage = /** @type {(inputs: Section_UsageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`System usage`)
};

export const section_usage_hint = /** @type {(inputs: Section_Usage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active reviewers per month and the average check duration.`)
};

export const section_work_types = /** @type {(inputs: Section_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By work type`)
};

export const section_work_types_hint = /** @type {(inputs: Section_Work_Types_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks and average originality broken down by type of written work.`)
};

export const section_yoy = /** @type {(inputs: Section_YoyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Year over year`)
};

export const section_yoy_hint = /** @type {(inputs: Section_Yoy_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The figures compared by academic year (1 September - 31 August).`)
};

export const setting_autumn_start = /** @type {(inputs: Setting_Autumn_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autumn semester start`)
};

export const setting_exclude_deleted = /** @type {(inputs: Setting_Exclude_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exclude deleted documents`)
};

export const setting_exclude_deleted_hint = /** @type {(inputs: Setting_Exclude_Deleted_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rows marked deleted stay out of the aggregates.`)
};

export const setting_histogram_buckets = /** @type {(inputs: Setting_Histogram_BucketsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality band edges`)
};

export const setting_histogram_buckets_hint = /** @type {(inputs: Setting_Histogram_Buckets_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Percentages, comma separated and ascending, e.g. 50, 70, 85, 95.`)
};

export const setting_histogram_buckets_invalid = /** @type {(inputs: Setting_Histogram_Buckets_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edges must ascend and stay between 0 and 100`)
};

export const setting_k_threshold = /** @type {(inputs: Setting_K_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`k-anonymity threshold`)
};

export const setting_k_threshold_hint = /** @type {(inputs: Setting_K_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Groups smaller than k are not published. The recommended value is 5.`)
};

export const setting_originality_threshold = /** @type {(inputs: Setting_Originality_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality threshold, %`)
};

export const setting_originality_threshold_hint = /** @type {(inputs: Setting_Originality_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Works below the threshold count as needing attention. The default is 70.`)
};

export const setting_semester_hint = /** @type {(inputs: Setting_Semester_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Format MM-DD.`)
};

export const setting_snapshot_quarter = /** @type {(inputs: Setting_Snapshot_QuarterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Public snapshot quarter`)
};

export const setting_snapshot_quarter_hint = /** @type {(inputs: Setting_Snapshot_Quarter_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«auto» - together with the internal refresh.`)
};

export const setting_spring_start = /** @type {(inputs: Setting_Spring_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Spring semester start`)
};

export const setting_status_rules = /** @type {(inputs: Setting_Status_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status derivation rules`)
};

export const setting_status_rules_hint = /** @type {(inputs: Setting_Status_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON: default, escalate_when and a list of status/when rules.`)
};

export const settings_save = /** @type {(inputs: Settings_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save settings`)
};

export const settings_saved_hint = /** @type {(inputs: Settings_Saved_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The API response cache was cleared - the change is visible immediately.`)
};

export const settings_unchanged = /** @type {(inputs: Settings_UnchangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing changed`)
};

export const settings_updated = /** @type {(inputs: Settings_UpdatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Last changed ${i?.date} by ${i?.who}`)
};

export const settings_updated_by_system = /** @type {(inputs: Settings_Updated_By_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`the system`)
};

export const source_base_url = /** @type {(inputs: Source_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source address`)
};

export const source_base_url_hint = /** @type {(inputs: Source_Base_Url_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL for an API source, watched directory for a CSV one.`)
};

export const source_cursor = /** @type {(inputs: Source_CursorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cursor`)
};

export const source_cursor_absent = /** @type {(inputs: Source_Cursor_AbsentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`not set`)
};

export const source_cursor_present = /** @type {(inputs: Source_Cursor_PresentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`set`)
};

export const source_disable = /** @type {(inputs: Source_DisableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disable`)
};

export const source_enable = /** @type {(inputs: Source_EnableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable`)
};

export const source_enabled = /** @type {(inputs: Source_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`State`)
};

export const source_enabled_no = /** @type {(inputs: Source_Enabled_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disabled`)
};

export const source_enabled_yes = /** @type {(inputs: Source_Enabled_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enabled`)
};

export const source_kind = /** @type {(inputs: Source_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kind`)
};

export const source_kind_api = /** @type {(inputs: Source_Kind_ApiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`REST API`)
};

export const source_kind_csv = /** @type {(inputs: Source_Kind_CsvInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CSV files`)
};

export const source_none = /** @type {(inputs: Source_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No sources configured.`)
};

export const source_run = /** @type {(inputs: Source_RunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Run import`)
};

export const source_run_started = /** @type {(inputs: Source_Run_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The run has started - watch the import journal.`)
};

export const source_schedule = /** @type {(inputs: Source_ScheduleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Schedule`)
};

export const source_schedule_hint = /** @type {(inputs: Source_Schedule_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cron expression; empty means manual runs only.`)
};

export const staff_unit_email = /** @type {(inputs: Staff_Unit_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reviewer e-mail`)
};

export const staff_unit_email_hint = /** @type {(inputs: Staff_Unit_Email_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The address is neither stored nor logged: the server keeps only an irreversible hash and a mask.`)
};

export const staff_unit_masked = /** @type {(inputs: Staff_Unit_MaskedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Masked address`)
};

export const staff_unit_none = /** @type {(inputs: Staff_Unit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No mappings defined.`)
};

export const staff_unit_updated = /** @type {(inputs: Staff_Unit_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Updated`)
};

export const staff_units_hint = /** @type {(inputs: Staff_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ties a reviewer to a faculty and department; the unit breakdown is built on it.`)
};

export const staff_units_title = /** @type {(inputs: Staff_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reviewers and units`)
};

export const status_accepted = /** @type {(inputs: Status_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accepted`)
};

export const status_needs_revision = /** @type {(inputs: Status_Needs_RevisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Needs revision`)
};

export const status_recheck = /** @type {(inputs: Status_RecheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recheck`)
};

export const status_rejected = /** @type {(inputs: Status_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected`)
};

export const table_actions = /** @type {(inputs: Table_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actions`)
};

export const units_coverage_footnote = /** @type {(inputs: Units_Coverage_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The breakdown by unit follows the current reviewer-to-unit mapping; for past academic years it is approximate.`)
};

export const units_margin_footnote = /** @type {(inputs: Units_Margin_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A faculty total includes departments whose own cells are suppressed, so the visible rows need not add up to it.`)
};

export const units_own_scope_only = /** @type {(inputs: Units_Own_Scope_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No breakdown: your scope is a single unit, and its figures are above.`)
};

export const units_pending_mapping_footnote = /** @type {(inputs: Units_Pending_Mapping_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The breakdown by unit becomes available once the mapping of reviewers to units has been loaded.`)
};

export const units_program_footnote = /** @type {(inputs: Units_Program_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A breakdown by study programme is not available yet.`)
};

export const units_unassigned_footnote = /** @type {(inputs: Units_Unassigned_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«Unassigned» covers checks whose reviewing unit could not be resolved.`)
};

export const usage_avg_duration = /** @type {(inputs: Usage_Avg_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average check duration`)
};

export const usage_avg_duration_hint = /** @type {(inputs: Usage_Avg_Duration_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entered by hand by the compliance office; the source export does not carry it.`)
};

export const usage_no_data = /** @type {(inputs: Usage_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no data`)
};

export const usage_seconds = /** @type {(inputs: Usage_SecondsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} s`)
};

export const work_type_rules_hint = /** @type {(inputs: Work_Type_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Derive the work type from the document title.`)
};

export const work_type_rules_title = /** @type {(inputs: Work_Type_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work-type rules`)
};

export const work_types_single_bucket = /** @type {(inputs: Work_Types_Single_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No breakdown by work type is available: the source export carries no work-type field, and fewer than one per cent of checks can be classified from the document title. Everything else falls to «other».`)
};