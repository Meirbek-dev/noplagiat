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
export const action_add: (inputs: Action_AddInputs) => LocalizedString;
export const action_delete: (inputs: Action_DeleteInputs) => LocalizedString;
export const action_save: (inputs: Action_SaveInputs) => LocalizedString;
export const admin_audit: (inputs: Admin_AuditInputs) => LocalizedString;
export const admin_audit_hint: (inputs: Admin_Audit_HintInputs) => LocalizedString;
export const admin_batch_rows: (inputs: Admin_Batch_RowsInputs) => LocalizedString;
export const admin_batch_stale: (inputs: Admin_Batch_StaleInputs) => LocalizedString;
export const admin_counts: (inputs: Admin_CountsInputs) => LocalizedString;
export const admin_counts_hint: (inputs: Admin_Counts_HintInputs) => LocalizedString;
export const admin_dictionaries: (inputs: Admin_DictionariesInputs) => LocalizedString;
export const admin_last_batch: (inputs: Admin_Last_BatchInputs) => LocalizedString;
export const admin_last_batch_hint: (inputs: Admin_Last_Batch_HintInputs) => LocalizedString;
export const admin_nav_areas: (inputs: Admin_Nav_AreasInputs) => LocalizedString;
export const admin_overview: (inputs: Admin_OverviewInputs) => LocalizedString;
export const admin_quick_links: (inputs: Admin_Quick_LinksInputs) => LocalizedString;
export const admin_reports: (inputs: Admin_ReportsInputs) => LocalizedString;
export const admin_reports_hint: (inputs: Admin_Reports_HintInputs) => LocalizedString;
export const admin_reports_unpublished: (inputs: Admin_Reports_UnpublishedInputs) => LocalizedString;
export const admin_roles: (inputs: Admin_RolesInputs) => LocalizedString;
export const admin_roles_hint: (inputs: Admin_Roles_HintInputs) => LocalizedString;
export const admin_settings: (inputs: Admin_SettingsInputs) => LocalizedString;
export const admin_settings_hint: (inputs: Admin_Settings_HintInputs) => LocalizedString;
export const admin_sources: (inputs: Admin_SourcesInputs) => LocalizedString;
export const admin_sources_hint: (inputs: Admin_Sources_HintInputs) => LocalizedString;
export const admin_title: (inputs: Admin_TitleInputs) => LocalizedString;
export const alias_kind: (inputs: Alias_KindInputs) => LocalizedString;
export const alias_none: (inputs: Alias_NoneInputs) => LocalizedString;
export const alias_source_label: (inputs: Alias_Source_LabelInputs) => LocalizedString;
export const alias_target: (inputs: Alias_TargetInputs) => LocalizedString;
export const alias_target_code: (inputs: Alias_Target_CodeInputs) => LocalizedString;
export const aliases_hint: (inputs: Aliases_HintInputs) => LocalizedString;
export const aliases_title: (inputs: Aliases_TitleInputs) => LocalizedString;
export const app_error_body: (inputs: App_Error_BodyInputs) => LocalizedString;
export const app_error_home: (inputs: App_Error_HomeInputs) => LocalizedString;
export const app_error_title: (inputs: App_Error_TitleInputs) => LocalizedString;
export const app_title: (inputs: App_TitleInputs) => LocalizedString;
export const app_title_full: (inputs: App_Title_FullInputs) => LocalizedString;
export const audit_action: (inputs: Audit_ActionInputs) => LocalizedString;
export const audit_action_admin_change: (inputs: Audit_Action_Admin_ChangeInputs) => LocalizedString;
export const audit_action_export_pdf: (inputs: Audit_Action_Export_PdfInputs) => LocalizedString;
export const audit_action_export_xlsx: (inputs: Audit_Action_Export_XlsxInputs) => LocalizedString;
export const audit_action_view: (inputs: Audit_Action_ViewInputs) => LocalizedString;
export const audit_any: (inputs: Audit_AnyInputs) => LocalizedString;
export const audit_filters: (inputs: Audit_FiltersInputs) => LocalizedString;
export const audit_footer: (inputs: Audit_FooterInputs) => LocalizedString;
export const audit_ip: (inputs: Audit_IpInputs) => LocalizedString;
export const audit_none: (inputs: Audit_NoneInputs) => LocalizedString;
export const audit_role: (inputs: Audit_RoleInputs) => LocalizedString;
export const audit_section: (inputs: Audit_SectionInputs) => LocalizedString;
export const audit_time: (inputs: Audit_TimeInputs) => LocalizedString;
export const audit_user: (inputs: Audit_UserInputs) => LocalizedString;
export const batch_errors_empty: (inputs: Batch_Errors_EmptyInputs) => LocalizedString;
export const batch_errors_hide: (inputs: Batch_Errors_HideInputs) => LocalizedString;
export const batch_errors_show: (inputs: Batch_Errors_ShowInputs) => LocalizedString;
export const batch_errors_title: (inputs: Batch_Errors_TitleInputs) => LocalizedString;
export const batch_rows_read: (inputs: Batch_Rows_ReadInputs) => LocalizedString;
export const batch_rows_rejected: (inputs: Batch_Rows_RejectedInputs) => LocalizedString;
export const batch_rows_skipped: (inputs: Batch_Rows_SkippedInputs) => LocalizedString;
export const batch_rows_upserted: (inputs: Batch_Rows_UpsertedInputs) => LocalizedString;
export const batch_source: (inputs: Batch_SourceInputs) => LocalizedString;
export const batch_started: (inputs: Batch_StartedInputs) => LocalizedString;
export const batch_status: (inputs: Batch_StatusInputs) => LocalizedString;
export const batch_status_failed: (inputs: Batch_Status_FailedInputs) => LocalizedString;
export const batch_status_running: (inputs: Batch_Status_RunningInputs) => LocalizedString;
export const batch_status_succeeded: (inputs: Batch_Status_SucceededInputs) => LocalizedString;
export const batches_empty: (inputs: Batches_EmptyInputs) => LocalizedString;
export const batches_hint: (inputs: Batches_HintInputs) => LocalizedString;
export const batches_title: (inputs: Batches_TitleInputs) => LocalizedString;
export const brand_lockup: (inputs: Brand_LockupInputs) => LocalizedString;
export const chart_axis_academic_year: (inputs: Chart_Axis_Academic_YearInputs) => LocalizedString;
export const chart_axis_active_reviewers: (inputs: Chart_Axis_Active_ReviewersInputs) => LocalizedString;
export const chart_axis_category: (inputs: Chart_Axis_CategoryInputs) => LocalizedString;
export const chart_axis_count: (inputs: Chart_Axis_CountInputs) => LocalizedString;
export const chart_axis_faculty: (inputs: Chart_Axis_FacultyInputs) => LocalizedString;
export const chart_axis_month: (inputs: Chart_Axis_MonthInputs) => LocalizedString;
export const chart_axis_originality: (inputs: Chart_Axis_OriginalityInputs) => LocalizedString;
export const chart_axis_share: (inputs: Chart_Axis_ShareInputs) => LocalizedString;
export const chart_axis_value: (inputs: Chart_Axis_ValueInputs) => LocalizedString;
export const chart_axis_work_type: (inputs: Chart_Axis_Work_TypeInputs) => LocalizedString;
export const chart_bucket_50_70: (inputs: Chart_Bucket_50_70Inputs) => LocalizedString;
export const chart_bucket_70_85: (inputs: Chart_Bucket_70_85Inputs) => LocalizedString;
export const chart_bucket_85_95: (inputs: Chart_Bucket_85_95Inputs) => LocalizedString;
export const chart_bucket_gte_95: (inputs: Chart_Bucket_Gte_95Inputs) => LocalizedString;
export const chart_bucket_lt_50: (inputs: Chart_Bucket_Lt_50Inputs) => LocalizedString;
export const chart_data_table: (inputs: Chart_Data_TableInputs) => LocalizedString;
export const chart_dynamics_flags_title: (inputs: Chart_Dynamics_Flags_TitleInputs) => LocalizedString;
export const chart_dynamics_title: (inputs: Chart_Dynamics_TitleInputs) => LocalizedString;
export const chart_empty: (inputs: Chart_EmptyInputs) => LocalizedString;
export const chart_faculties_title: (inputs: Chart_Faculties_TitleInputs) => LocalizedString;
export const chart_heatmap_scale: (inputs: Chart_Heatmap_ScaleInputs) => LocalizedString;
export const chart_heatmap_unit: (inputs: Chart_Heatmap_UnitInputs) => LocalizedString;
export const chart_histogram_bucket: (inputs: Chart_Histogram_BucketInputs) => LocalizedString;
export const chart_histogram_title: (inputs: Chart_Histogram_TitleInputs) => LocalizedString;
export const chart_kpi_delta_down: (inputs: Chart_Kpi_Delta_DownInputs) => LocalizedString;
export const chart_kpi_delta_flat: (inputs: Chart_Kpi_Delta_FlatInputs) => LocalizedString;
export const chart_kpi_delta_up: (inputs: Chart_Kpi_Delta_UpInputs) => LocalizedString;
export const chart_kpi_previous: (inputs: Chart_Kpi_PreviousInputs) => LocalizedString;
export const chart_kpi_sparkline: (inputs: Chart_Kpi_SparklineInputs) => LocalizedString;
export const chart_legend: (inputs: Chart_LegendInputs) => LocalizedString;
export const chart_semester_autumn: (inputs: Chart_Semester_AutumnInputs) => LocalizedString;
export const chart_semester_bands: (inputs: Chart_Semester_BandsInputs) => LocalizedString;
export const chart_semester_shading: (inputs: Chart_Semester_ShadingInputs) => LocalizedString;
export const chart_semester_spring: (inputs: Chart_Semester_SpringInputs) => LocalizedString;
export const chart_series_active_reviewers: (inputs: Chart_Series_Active_ReviewersInputs) => LocalizedString;
export const chart_series_checks: (inputs: Chart_Series_ChecksInputs) => LocalizedString;
export const chart_series_escalated: (inputs: Chart_Series_EscalatedInputs) => LocalizedString;
export const chart_series_originality: (inputs: Chart_Series_OriginalityInputs) => LocalizedString;
export const chart_series_rechecks: (inputs: Chart_Series_RechecksInputs) => LocalizedString;
export const chart_suppressed_note: (inputs: Chart_Suppressed_NoteInputs) => LocalizedString;
export const chart_units_title: (inputs: Chart_Units_TitleInputs) => LocalizedString;
export const chart_usage_title: (inputs: Chart_Usage_TitleInputs) => LocalizedString;
export const chart_work_types_counts: (inputs: Chart_Work_Types_CountsInputs) => LocalizedString;
export const chart_work_types_originality: (inputs: Chart_Work_Types_OriginalityInputs) => LocalizedString;
export const confirm_delete: (inputs: Confirm_DeleteInputs) => LocalizedString;
export const confirm_revoke_role: (inputs: Confirm_Revoke_RoleInputs) => LocalizedString;
export const confirm_unpublish_report: (inputs: Confirm_Unpublish_ReportInputs) => LocalizedString;
export const dict_active: (inputs: Dict_ActiveInputs) => LocalizedString;
export const dict_active_no: (inputs: Dict_Active_NoInputs) => LocalizedString;
export const dict_active_yes: (inputs: Dict_Active_YesInputs) => LocalizedString;
export const dict_code: (inputs: Dict_CodeInputs) => LocalizedString;
export const dict_code_hint: (inputs: Dict_Code_HintInputs) => LocalizedString;
export const dict_entries: (inputs: Dict_EntriesInputs) => LocalizedString;
export const dict_entries_hint: (inputs: Dict_Entries_HintInputs) => LocalizedString;
export const dict_name_en: (inputs: Dict_Name_EnInputs) => LocalizedString;
export const dict_name_kk: (inputs: Dict_Name_KkInputs) => LocalizedString;
export const dict_name_ru: (inputs: Dict_Name_RuInputs) => LocalizedString;
export const dict_none: (inputs: Dict_NoneInputs) => LocalizedString;
export const dict_parent: (inputs: Dict_ParentInputs) => LocalizedString;
export const dict_parent_none: (inputs: Dict_Parent_NoneInputs) => LocalizedString;
export const dict_sort_order: (inputs: Dict_Sort_OrderInputs) => LocalizedString;
export const dict_tab_departments: (inputs: Dict_Tab_DepartmentsInputs) => LocalizedString;
export const dict_tab_faculties: (inputs: Dict_Tab_FacultiesInputs) => LocalizedString;
export const dict_tab_programs: (inputs: Dict_Tab_ProgramsInputs) => LocalizedString;
export const dict_tab_work_types: (inputs: Dict_Tab_Work_TypesInputs) => LocalizedString;
export const embed_title: (inputs: Embed_TitleInputs) => LocalizedString;
export const error_out_of_scope: (inputs: Error_Out_Of_ScopeInputs) => LocalizedString;
export const error_role_denied: (inputs: Error_Role_DeniedInputs) => LocalizedString;
export const error_session_expired: (inputs: Error_Session_ExpiredInputs) => LocalizedString;
export const escalations_units_note: (inputs: Escalations_Units_NoteInputs) => LocalizedString;
export const escalations_units_title: (inputs: Escalations_Units_TitleInputs) => LocalizedString;
export const ethics_cases_empty: (inputs: Ethics_Cases_EmptyInputs) => LocalizedString;
export const ethics_cases_title: (inputs: Ethics_Cases_TitleInputs) => LocalizedString;
export const ethics_category: (inputs: Ethics_CategoryInputs) => LocalizedString;
export const ethics_closed: (inputs: Ethics_ClosedInputs) => LocalizedString;
export const ethics_referred: (inputs: Ethics_ReferredInputs) => LocalizedString;
export const ethics_year: (inputs: Ethics_YearInputs) => LocalizedString;
export const export_busy: (inputs: Export_BusyInputs) => LocalizedString;
export const export_error: (inputs: Export_ErrorInputs) => LocalizedString;
export const export_official_use: (inputs: Export_Official_UseInputs) => LocalizedString;
export const export_pdf: (inputs: Export_PdfInputs) => LocalizedString;
export const export_public_hint: (inputs: Export_Public_HintInputs) => LocalizedString;
export const export_title: (inputs: Export_TitleInputs) => LocalizedString;
export const export_xlsx: (inputs: Export_XlsxInputs) => LocalizedString;
export const filter_all_departments: (inputs: Filter_All_DepartmentsInputs) => LocalizedString;
export const filter_all_faculties: (inputs: Filter_All_FacultiesInputs) => LocalizedString;
export const filter_all_statuses: (inputs: Filter_All_StatusesInputs) => LocalizedString;
export const filter_all_work_types: (inputs: Filter_All_Work_TypesInputs) => LocalizedString;
export const filter_bar_title: (inputs: Filter_Bar_TitleInputs) => LocalizedString;
export const filter_department: (inputs: Filter_DepartmentInputs) => LocalizedString;
export const filter_faculty: (inputs: Filter_FacultyInputs) => LocalizedString;
export const filter_from: (inputs: Filter_FromInputs) => LocalizedString;
export const filter_period: (inputs: Filter_PeriodInputs) => LocalizedString;
export const filter_period_3y: (inputs: Filter_Period_3yInputs) => LocalizedString;
export const filter_period_5y: (inputs: Filter_Period_5yInputs) => LocalizedString;
export const filter_period_custom: (inputs: Filter_Period_CustomInputs) => LocalizedString;
export const filter_period_month: (inputs: Filter_Period_MonthInputs) => LocalizedString;
export const filter_period_semester: (inputs: Filter_Period_SemesterInputs) => LocalizedString;
export const filter_period_shown: (inputs: Filter_Period_ShownInputs) => LocalizedString;
export const filter_period_year: (inputs: Filter_Period_YearInputs) => LocalizedString;
export const filter_program: (inputs: Filter_ProgramInputs) => LocalizedString;
export const filter_program_hint: (inputs: Filter_Program_HintInputs) => LocalizedString;
export const filter_program_placeholder: (inputs: Filter_Program_PlaceholderInputs) => LocalizedString;
export const filter_reset: (inputs: Filter_ResetInputs) => LocalizedString;
export const filter_status: (inputs: Filter_StatusInputs) => LocalizedString;
export const filter_to: (inputs: Filter_ToInputs) => LocalizedString;
export const filter_work_type: (inputs: Filter_Work_TypeInputs) => LocalizedString;
export const footer_about_body: (inputs: Footer_About_BodyInputs) => LocalizedString;
export const footer_about_title: (inputs: Footer_About_TitleInputs) => LocalizedString;
export const footer_sections_title: (inputs: Footer_Sections_TitleInputs) => LocalizedString;
export const footer_staff_link: (inputs: Footer_Staff_LinkInputs) => LocalizedString;
export const footer_updated: (inputs: Footer_UpdatedInputs) => LocalizedString;
export const form_error: (inputs: Form_ErrorInputs) => LocalizedString;
export const form_invalid_email: (inputs: Form_Invalid_EmailInputs) => LocalizedString;
export const form_invalid_json: (inputs: Form_Invalid_JsonInputs) => LocalizedString;
export const form_invalid_number: (inputs: Form_Invalid_NumberInputs) => LocalizedString;
export const form_required: (inputs: Form_RequiredInputs) => LocalizedString;
export const form_saved: (inputs: Form_SavedInputs) => LocalizedString;
export const form_saving: (inputs: Form_SavingInputs) => LocalizedString;
export const header_locale_label: (inputs: Header_Locale_LabelInputs) => LocalizedString;
export const header_skip_link: (inputs: Header_Skip_LinkInputs) => LocalizedString;
export const initiator_other: (inputs: Initiator_OtherInputs) => LocalizedString;
export const initiator_registrar: (inputs: Initiator_RegistrarInputs) => LocalizedString;
export const initiator_rules_hint: (inputs: Initiator_Rules_HintInputs) => LocalizedString;
export const initiator_rules_title: (inputs: Initiator_Rules_TitleInputs) => LocalizedString;
export const initiator_staff_self: (inputs: Initiator_Staff_SelfInputs) => LocalizedString;
export const initiator_student: (inputs: Initiator_StudentInputs) => LocalizedString;
export const insufficient_data: (inputs: Insufficient_DataInputs) => LocalizedString;
export const internal_contour_title: (inputs: Internal_Contour_TitleInputs) => LocalizedString;
export const internal_nav_other: (inputs: Internal_Nav_OtherInputs) => LocalizedString;
export const internal_nav_public: (inputs: Internal_Nav_PublicInputs) => LocalizedString;
export const internal_nav_sections: (inputs: Internal_Nav_SectionsInputs) => LocalizedString;
export const internal_nav_toggle: (inputs: Internal_Nav_ToggleInputs) => LocalizedString;
export const internal_overview_hint: (inputs: Internal_Overview_HintInputs) => LocalizedString;
export const k_threshold_note: (inputs: K_Threshold_NoteInputs) => LocalizedString;
export const kpi_avg_originality: (inputs: Kpi_Avg_OriginalityInputs) => LocalizedString;
export const kpi_avg_originality_hint: (inputs: Kpi_Avg_Originality_HintInputs) => LocalizedString;
export const kpi_below_threshold: (inputs: Kpi_Below_ThresholdInputs) => LocalizedString;
export const kpi_below_threshold_hint: (inputs: Kpi_Below_Threshold_HintInputs) => LocalizedString;
export const kpi_coverage: (inputs: Kpi_CoverageInputs) => LocalizedString;
export const kpi_coverage_hint: (inputs: Kpi_Coverage_HintInputs) => LocalizedString;
export const kpi_escalated: (inputs: Kpi_EscalatedInputs) => LocalizedString;
export const kpi_escalated_hint: (inputs: Kpi_Escalated_HintInputs) => LocalizedString;
export const kpi_escalated_share: (inputs: Kpi_Escalated_ShareInputs) => LocalizedString;
export const kpi_escalated_share_hint: (inputs: Kpi_Escalated_Share_HintInputs) => LocalizedString;
export const kpi_improved: (inputs: Kpi_ImprovedInputs) => LocalizedString;
export const kpi_improved_share: (inputs: Kpi_Improved_ShareInputs) => LocalizedString;
export const kpi_improved_share_hint: (inputs: Kpi_Improved_Share_HintInputs) => LocalizedString;
export const kpi_recheck_share: (inputs: Kpi_Recheck_ShareInputs) => LocalizedString;
export const kpi_recheck_share_hint: (inputs: Kpi_Recheck_Share_HintInputs) => LocalizedString;
export const kpi_total_checks: (inputs: Kpi_Total_ChecksInputs) => LocalizedString;
export const kpi_total_checks_hint: (inputs: Kpi_Total_Checks_HintInputs) => LocalizedString;
export const kpi_works_rechecked: (inputs: Kpi_Works_RecheckedInputs) => LocalizedString;
export const kpi_works_rechecked_hint: (inputs: Kpi_Works_Rechecked_HintInputs) => LocalizedString;
export const kpi_works_total: (inputs: Kpi_Works_TotalInputs) => LocalizedString;
export const kpi_works_total_hint: (inputs: Kpi_Works_Total_HintInputs) => LocalizedString;
export const locale_name_en: (inputs: Locale_Name_EnInputs) => LocalizedString;
export const locale_name_kk: (inputs: Locale_Name_KkInputs) => LocalizedString;
export const locale_name_ru: (inputs: Locale_Name_RuInputs) => LocalizedString;
export const login_failed: (inputs: Login_FailedInputs) => LocalizedString;
export const login_hint: (inputs: Login_HintInputs) => LocalizedString;
export const login_no_account: (inputs: Login_No_AccountInputs) => LocalizedString;
export const login_password: (inputs: Login_PasswordInputs) => LocalizedString;
export const login_submit: (inputs: Login_SubmitInputs) => LocalizedString;
export const login_throttled: (inputs: Login_ThrottledInputs) => LocalizedString;
export const login_title: (inputs: Login_TitleInputs) => LocalizedString;
export const login_username: (inputs: Login_UsernameInputs) => LocalizedString;
export const logout_button: (inputs: Logout_ButtonInputs) => LocalizedString;
export const not_found_title: (inputs: Not_Found_TitleInputs) => LocalizedString;
export const public_contour_title: (inputs: Public_Contour_TitleInputs) => LocalizedString;
export const rechecks_units_title: (inputs: Rechecks_Units_TitleInputs) => LocalizedString;
export const report_files: (inputs: Report_FilesInputs) => LocalizedString;
export const report_files_after_publish: (inputs: Report_Files_After_PublishInputs) => LocalizedString;
export const report_generate: (inputs: Report_GenerateInputs) => LocalizedString;
export const report_generate_hint: (inputs: Report_Generate_HintInputs) => LocalizedString;
export const report_generated_at: (inputs: Report_Generated_AtInputs) => LocalizedString;
export const report_generated_ok: (inputs: Report_Generated_OkInputs) => LocalizedString;
export const report_kind: (inputs: Report_KindInputs) => LocalizedString;
export const report_locale: (inputs: Report_LocaleInputs) => LocalizedString;
export const report_none: (inputs: Report_NoneInputs) => LocalizedString;
export const report_period: (inputs: Report_PeriodInputs) => LocalizedString;
export const report_publish: (inputs: Report_PublishInputs) => LocalizedString;
export const report_published: (inputs: Report_PublishedInputs) => LocalizedString;
export const report_published_state: (inputs: Report_Published_StateInputs) => LocalizedString;
export const report_unpublish: (inputs: Report_UnpublishInputs) => LocalizedString;
export const report_unpublished: (inputs: Report_UnpublishedInputs) => LocalizedString;
export const reports_download: (inputs: Reports_DownloadInputs) => LocalizedString;
export const reports_empty: (inputs: Reports_EmptyInputs) => LocalizedString;
export const reports_generated: (inputs: Reports_GeneratedInputs) => LocalizedString;
export const reports_kind_annual: (inputs: Reports_Kind_AnnualInputs) => LocalizedString;
export const reports_kind_manual: (inputs: Reports_Kind_ManualInputs) => LocalizedString;
export const request_access_account: (inputs: Request_Access_AccountInputs) => LocalizedString;
export const request_access_back: (inputs: Request_Access_BackInputs) => LocalizedString;
export const request_access_body: (inputs: Request_Access_BodyInputs) => LocalizedString;
export const request_access_staff_note: (inputs: Request_Access_Staff_NoteInputs) => LocalizedString;
export const request_access_step_admin: (inputs: Request_Access_Step_AdminInputs) => LocalizedString;
export const request_access_step_head: (inputs: Request_Access_Step_HeadInputs) => LocalizedString;
export const request_access_step_signin: (inputs: Request_Access_Step_SigninInputs) => LocalizedString;
export const request_access_title: (inputs: Request_Access_TitleInputs) => LocalizedString;
export const role_admin: (inputs: Role_AdminInputs) => LocalizedString;
export const role_compliance: (inputs: Role_ComplianceInputs) => LocalizedString;
export const role_dean: (inputs: Role_DeanInputs) => LocalizedString;
export const role_dept_head: (inputs: Role_Dept_HeadInputs) => LocalizedString;
export const role_ethics: (inputs: Role_EthicsInputs) => LocalizedString;
export const role_none: (inputs: Role_NoneInputs) => LocalizedString;
export const role_staff: (inputs: Role_StaffInputs) => LocalizedString;
export const roles_account: (inputs: Roles_AccountInputs) => LocalizedString;
export const roles_active: (inputs: Roles_ActiveInputs) => LocalizedString;
export const roles_active_no: (inputs: Roles_Active_NoInputs) => LocalizedString;
export const roles_active_yes: (inputs: Roles_Active_YesInputs) => LocalizedString;
export const roles_grant: (inputs: Roles_GrantInputs) => LocalizedString;
export const roles_grant_hint: (inputs: Roles_Grant_HintInputs) => LocalizedString;
export const roles_grant_submit: (inputs: Roles_Grant_SubmitInputs) => LocalizedString;
export const roles_grants: (inputs: Roles_GrantsInputs) => LocalizedString;
export const roles_none: (inputs: Roles_NoneInputs) => LocalizedString;
export const roles_revoke: (inputs: Roles_RevokeInputs) => LocalizedString;
export const roles_role: (inputs: Roles_RoleInputs) => LocalizedString;
export const roles_scope_department: (inputs: Roles_Scope_DepartmentInputs) => LocalizedString;
export const roles_scope_department_required: (inputs: Roles_Scope_Department_RequiredInputs) => LocalizedString;
export const roles_scope_faculty: (inputs: Roles_Scope_FacultyInputs) => LocalizedString;
export const roles_scope_faculty_required: (inputs: Roles_Scope_Faculty_RequiredInputs) => LocalizedString;
export const roles_scope_none: (inputs: Roles_Scope_NoneInputs) => LocalizedString;
export const roles_subject: (inputs: Roles_SubjectInputs) => LocalizedString;
export const rule_activate: (inputs: Rule_ActivateInputs) => LocalizedString;
export const rule_active: (inputs: Rule_ActiveInputs) => LocalizedString;
export const rule_deactivate: (inputs: Rule_DeactivateInputs) => LocalizedString;
export const rule_initiator: (inputs: Rule_InitiatorInputs) => LocalizedString;
export const rule_none: (inputs: Rule_NoneInputs) => LocalizedString;
export const rule_pattern: (inputs: Rule_PatternInputs) => LocalizedString;
export const rule_pattern_hint: (inputs: Rule_Pattern_HintInputs) => LocalizedString;
export const rule_priority: (inputs: Rule_PriorityInputs) => LocalizedString;
export const rule_priority_hint: (inputs: Rule_Priority_HintInputs) => LocalizedString;
export const rule_regex_hint: (inputs: Rule_Regex_HintInputs) => LocalizedString;
export const rule_work_type: (inputs: Rule_Work_TypeInputs) => LocalizedString;
export const scope_all: (inputs: Scope_AllInputs) => LocalizedString;
export const scope_department: (inputs: Scope_DepartmentInputs) => LocalizedString;
export const scope_faculty: (inputs: Scope_FacultyInputs) => LocalizedString;
export const scope_none: (inputs: Scope_NoneInputs) => LocalizedString;
export const section_dynamics: (inputs: Section_DynamicsInputs) => LocalizedString;
export const section_dynamics_hint: (inputs: Section_Dynamics_HintInputs) => LocalizedString;
export const section_error_title: (inputs: Section_Error_TitleInputs) => LocalizedString;
export const section_error_unavailable: (inputs: Section_Error_UnavailableInputs) => LocalizedString;
export const section_escalations: (inputs: Section_EscalationsInputs) => LocalizedString;
export const section_escalations_hint: (inputs: Section_Escalations_HintInputs) => LocalizedString;
export const section_faculties: (inputs: Section_FacultiesInputs) => LocalizedString;
export const section_faculties_hint: (inputs: Section_Faculties_HintInputs) => LocalizedString;
export const section_histogram: (inputs: Section_HistogramInputs) => LocalizedString;
export const section_histogram_hint: (inputs: Section_Histogram_HintInputs) => LocalizedString;
export const section_in_development: (inputs: Section_In_DevelopmentInputs) => LocalizedString;
export const section_loading: (inputs: Section_LoadingInputs) => LocalizedString;
export const section_overview: (inputs: Section_OverviewInputs) => LocalizedString;
export const section_overview_hint: (inputs: Section_Overview_HintInputs) => LocalizedString;
export const section_rechecks: (inputs: Section_RechecksInputs) => LocalizedString;
export const section_rechecks_hint: (inputs: Section_Rechecks_HintInputs) => LocalizedString;
export const section_reports: (inputs: Section_ReportsInputs) => LocalizedString;
export const section_reports_hint: (inputs: Section_Reports_HintInputs) => LocalizedString;
export const section_retry: (inputs: Section_RetryInputs) => LocalizedString;
export const section_role_restricted: (inputs: Section_Role_RestrictedInputs) => LocalizedString;
export const section_units: (inputs: Section_UnitsInputs) => LocalizedString;
export const section_units_hint: (inputs: Section_Units_HintInputs) => LocalizedString;
export const section_usage: (inputs: Section_UsageInputs) => LocalizedString;
export const section_usage_hint: (inputs: Section_Usage_HintInputs) => LocalizedString;
export const section_work_types: (inputs: Section_Work_TypesInputs) => LocalizedString;
export const section_work_types_hint: (inputs: Section_Work_Types_HintInputs) => LocalizedString;
export const section_yoy: (inputs: Section_YoyInputs) => LocalizedString;
export const section_yoy_hint: (inputs: Section_Yoy_HintInputs) => LocalizedString;
export const setting_autumn_start: (inputs: Setting_Autumn_StartInputs) => LocalizedString;
export const setting_exclude_deleted: (inputs: Setting_Exclude_DeletedInputs) => LocalizedString;
export const setting_exclude_deleted_hint: (inputs: Setting_Exclude_Deleted_HintInputs) => LocalizedString;
export const setting_histogram_buckets: (inputs: Setting_Histogram_BucketsInputs) => LocalizedString;
export const setting_histogram_buckets_hint: (inputs: Setting_Histogram_Buckets_HintInputs) => LocalizedString;
export const setting_histogram_buckets_invalid: (inputs: Setting_Histogram_Buckets_InvalidInputs) => LocalizedString;
export const setting_k_threshold: (inputs: Setting_K_ThresholdInputs) => LocalizedString;
export const setting_k_threshold_hint: (inputs: Setting_K_Threshold_HintInputs) => LocalizedString;
export const setting_originality_threshold: (inputs: Setting_Originality_ThresholdInputs) => LocalizedString;
export const setting_originality_threshold_hint: (inputs: Setting_Originality_Threshold_HintInputs) => LocalizedString;
export const setting_semester_hint: (inputs: Setting_Semester_HintInputs) => LocalizedString;
export const setting_snapshot_quarter: (inputs: Setting_Snapshot_QuarterInputs) => LocalizedString;
export const setting_snapshot_quarter_hint: (inputs: Setting_Snapshot_Quarter_HintInputs) => LocalizedString;
export const setting_spring_start: (inputs: Setting_Spring_StartInputs) => LocalizedString;
export const setting_status_rules: (inputs: Setting_Status_RulesInputs) => LocalizedString;
export const setting_status_rules_hint: (inputs: Setting_Status_Rules_HintInputs) => LocalizedString;
export const settings_save: (inputs: Settings_SaveInputs) => LocalizedString;
export const settings_saved_hint: (inputs: Settings_Saved_HintInputs) => LocalizedString;
export const settings_unchanged: (inputs: Settings_UnchangedInputs) => LocalizedString;
export const settings_updated: (inputs: Settings_UpdatedInputs) => LocalizedString;
export const settings_updated_by_system: (inputs: Settings_Updated_By_SystemInputs) => LocalizedString;
export const source_base_url: (inputs: Source_Base_UrlInputs) => LocalizedString;
export const source_base_url_hint: (inputs: Source_Base_Url_HintInputs) => LocalizedString;
export const source_cursor: (inputs: Source_CursorInputs) => LocalizedString;
export const source_cursor_absent: (inputs: Source_Cursor_AbsentInputs) => LocalizedString;
export const source_cursor_present: (inputs: Source_Cursor_PresentInputs) => LocalizedString;
export const source_disable: (inputs: Source_DisableInputs) => LocalizedString;
export const source_enable: (inputs: Source_EnableInputs) => LocalizedString;
export const source_enabled: (inputs: Source_EnabledInputs) => LocalizedString;
export const source_enabled_no: (inputs: Source_Enabled_NoInputs) => LocalizedString;
export const source_enabled_yes: (inputs: Source_Enabled_YesInputs) => LocalizedString;
export const source_kind: (inputs: Source_KindInputs) => LocalizedString;
export const source_kind_api: (inputs: Source_Kind_ApiInputs) => LocalizedString;
export const source_kind_csv: (inputs: Source_Kind_CsvInputs) => LocalizedString;
export const source_none: (inputs: Source_NoneInputs) => LocalizedString;
export const source_run: (inputs: Source_RunInputs) => LocalizedString;
export const source_run_started: (inputs: Source_Run_StartedInputs) => LocalizedString;
export const source_schedule: (inputs: Source_ScheduleInputs) => LocalizedString;
export const source_schedule_hint: (inputs: Source_Schedule_HintInputs) => LocalizedString;
export const staff_unit_email: (inputs: Staff_Unit_EmailInputs) => LocalizedString;
export const staff_unit_email_hint: (inputs: Staff_Unit_Email_HintInputs) => LocalizedString;
export const staff_unit_masked: (inputs: Staff_Unit_MaskedInputs) => LocalizedString;
export const staff_unit_none: (inputs: Staff_Unit_NoneInputs) => LocalizedString;
export const staff_unit_updated: (inputs: Staff_Unit_UpdatedInputs) => LocalizedString;
export const staff_units_hint: (inputs: Staff_Units_HintInputs) => LocalizedString;
export const staff_units_title: (inputs: Staff_Units_TitleInputs) => LocalizedString;
export const status_accepted: (inputs: Status_AcceptedInputs) => LocalizedString;
export const status_needs_revision: (inputs: Status_Needs_RevisionInputs) => LocalizedString;
export const status_recheck: (inputs: Status_RecheckInputs) => LocalizedString;
export const status_rejected: (inputs: Status_RejectedInputs) => LocalizedString;
export const table_actions: (inputs: Table_ActionsInputs) => LocalizedString;
export const units_coverage_footnote: (inputs: Units_Coverage_FootnoteInputs) => LocalizedString;
export const units_margin_footnote: (inputs: Units_Margin_FootnoteInputs) => LocalizedString;
export const units_own_scope_only: (inputs: Units_Own_Scope_OnlyInputs) => LocalizedString;
export const units_pending_mapping_footnote: (inputs: Units_Pending_Mapping_FootnoteInputs) => LocalizedString;
export const units_program_footnote: (inputs: Units_Program_FootnoteInputs) => LocalizedString;
export const units_unassigned_footnote: (inputs: Units_Unassigned_FootnoteInputs) => LocalizedString;
export const usage_avg_duration: (inputs: Usage_Avg_DurationInputs) => LocalizedString;
export const usage_avg_duration_hint: (inputs: Usage_Avg_Duration_HintInputs) => LocalizedString;
export const usage_no_data: (inputs: Usage_No_DataInputs) => LocalizedString;
export const usage_seconds: (inputs: Usage_SecondsInputs) => LocalizedString;
export const work_type_rules_hint: (inputs: Work_Type_Rules_HintInputs) => LocalizedString;
export const work_type_rules_title: (inputs: Work_Type_Rules_TitleInputs) => LocalizedString;
export const work_types_single_bucket: (inputs: Work_Types_Single_BucketInputs) => LocalizedString;
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
