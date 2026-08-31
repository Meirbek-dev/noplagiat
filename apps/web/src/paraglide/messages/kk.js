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
	return /** @type {LocalizedString} */ (`Қосу`)
};

export const action_delete = /** @type {(inputs: Action_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жою`)
};

export const action_save = /** @type {(inputs: Action_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сақтау`)
};

export const admin_audit = /** @type {(inputs: Admin_AuditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қатынау журналы`)
};

export const admin_audit_hint = /** @type {(inputs: Admin_Audit_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ішкі контурға барлық жүгіну: кім, қашан, қай бөлімге және қандай сүзгілермен.`)
};

export const admin_batch_rows = /** @type {(inputs: Admin_Batch_RowsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Оқылды: ${i?.read} · жазылды: ${i?.upserted} · қабылданбады: ${i?.rejected}`)
};

export const admin_batch_stale = /** @type {(inputs: Admin_Batch_StaleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Деректер ${i?.hours} сағат жаңартылмаған`)
};

export const admin_counts = /** @type {(inputs: Admin_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалықтар мен дереккөздер`)
};

export const admin_counts_hint = /** @type {(inputs: Admin_Counts_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүйенің ағымдағы толтырылуы.`)
};

export const admin_dictionaries = /** @type {(inputs: Admin_DictionariesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалықтар`)
};

export const admin_last_batch = /** @type {(inputs: Admin_Last_BatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Соңғы жүктеме`)
};

export const admin_last_batch_hint = /** @type {(inputs: Admin_Last_Batch_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ішкі контур деректері тәулігіне кемінде бір рет жаңартылады.`)
};

export const admin_nav_areas = /** @type {(inputs: Admin_Nav_AreasInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әкімшілендіру бөлімдері`)
};

export const admin_overview = /** @type {(inputs: Admin_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шолу`)
};

export const admin_quick_links = /** @type {(inputs: Admin_Quick_LinksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдам өтулер`)
};

export const admin_reports = /** @type {(inputs: Admin_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есептер`)
};

export const admin_reports_hint = /** @type {(inputs: Admin_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өзгермейтін есеп суреттері. Жариялау файлды ашық контурға шығарады.`)
};

export const admin_reports_unpublished = /** @type {(inputs: Admin_Reports_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланбаған есептер`)
};

export const admin_roles = /** @type {(inputs: Admin_RolesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөлдер мен қолжетімділік`)
};

export const admin_roles_hint = /** @type {(inputs: Admin_Roles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркелгілер және оларға берілген рөлдер мен көріну аймақтары.`)
};

export const admin_settings = /** @type {(inputs: Admin_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Баптаулар`)
};

export const admin_settings_hint = /** @type {(inputs: Admin_Settings_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шектер, семестр шекаралары және шығару ережелері. Өзгеріс API-ге бірден қолданылады.`)
};

export const admin_sources = /** @type {(inputs: Admin_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректер көздері`)
};

export const admin_sources_hint = /** @type {(inputs: Admin_Sources_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректерді жүктеу көздері мен жаңарту кестелері; импортты қолмен іске қосу.`)
};

export const admin_title = /** @type {(inputs: Admin_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әкімшілендіру`)
};

export const alias_kind = /** @type {(inputs: Alias_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық түрі`)
};

export const alias_none = /** @type {(inputs: Alias_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сәйкестіктер белгіленбеген.`)
};

export const alias_source_label = /** @type {(inputs: Alias_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дереккөздегі атауы`)
};

export const alias_target = /** @type {(inputs: Alias_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық жазбасы`)
};

export const alias_target_code = /** @type {(inputs: Alias_Target_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мақсат коды`)
};

export const aliases_hint = /** @type {(inputs: Aliases_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бастапқы жүйенің атауларын дашборд анықтамалықтарына келтіреді.`)
};

export const aliases_title = /** @type {(inputs: Aliases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Атаулар сәйкестігі`)
};

export const app_error_body = /** @type {(inputs: App_Error_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бетті жаңартып көріңіз. Қате қайталанса, жүйе әкімшісіне хабарласыңыз.`)
};

export const app_error_home = /** @type {(inputs: App_Error_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басты бетке`)
};

export const app_error_title = /** @type {(inputs: App_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бет жүктелмеді`)
};

export const app_title = /** @type {(inputs: App_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Антиплагиат дашборды`)
};

export const app_title_full = /** @type {(inputs: App_Title_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Антиплагиат дашборды - Toraighyrov University`)
};

export const audit_action = /** @type {(inputs: Audit_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әрекет`)
};

export const audit_action_admin_change = /** @type {(inputs: Audit_Action_Admin_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Баптауларды өзгерту`)
};

export const audit_action_export_pdf = /** @type {(inputs: Audit_Action_Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF экспорты`)
};

export const audit_action_export_xlsx = /** @type {(inputs: Audit_Action_Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Excel экспорты`)
};

export const audit_action_view = /** @type {(inputs: Audit_Action_ViewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қарау`)
};

export const audit_any = /** @type {(inputs: Audit_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кез келген`)
};

export const audit_filters = /** @type {(inputs: Audit_FiltersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сүзгілер`)
};

export const audit_footer = /** @type {(inputs: Audit_FooterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Барлық жазба: ${i?.total}. Сақтау мерзімі - кемінде ${i?.days} күн; жою қарастырылмаған.`)
};

export const audit_ip = /** @type {(inputs: Audit_IpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IP-мекенжай`)
};

export const audit_none = /** @type {(inputs: Audit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Берілген сүзгілер бойынша жазба жоқ.`)
};

export const audit_role = /** @type {(inputs: Audit_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл`)
};

export const audit_section = /** @type {(inputs: Audit_SectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлім`)
};

export const audit_time = /** @type {(inputs: Audit_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Уақыты`)
};

export const audit_user = /** @type {(inputs: Audit_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пайдаланушы`)
};

export const batch_errors_empty = /** @type {(inputs: Batch_Errors_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қабылданбаған жазбалар жоқ.`)
};

export const batch_errors_hide = /** @type {(inputs: Batch_Errors_HideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қателерді жасыру`)
};

export const batch_errors_show = /** @type {(inputs: Batch_Errors_ShowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қателер`)
};

export const batch_errors_title = /** @type {(inputs: Batch_Errors_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`№${i?.id} жүктеменің қабылданбаған жазбалары`)
};

export const batch_rows_read = /** @type {(inputs: Batch_Rows_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оқылды`)
};

export const batch_rows_rejected = /** @type {(inputs: Batch_Rows_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қабылданбады`)
};

export const batch_rows_skipped = /** @type {(inputs: Batch_Rows_SkippedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өткізілді`)
};

export const batch_rows_upserted = /** @type {(inputs: Batch_Rows_UpsertedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жазылды`)
};

export const batch_source = /** @type {(inputs: Batch_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дереккөз`)
};

export const batch_started = /** @type {(inputs: Batch_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басталуы`)
};

export const batch_status = /** @type {(inputs: Batch_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Күйі`)
};

export const batch_status_failed = /** @type {(inputs: Batch_Status_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қате`)
};

export const batch_status_running = /** @type {(inputs: Batch_Status_RunningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Орындалуда`)
};

export const batch_status_succeeded = /** @type {(inputs: Batch_Status_SucceededInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сәтті`)
};

export const batches_empty = /** @type {(inputs: Batches_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әзірге жүктемелер болған жоқ.`)
};

export const batches_hint = /** @type {(inputs: Batches_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әрбір жүктеме тіркеледі: уақыты, дереккөзі, жазба саны, тексеру қателері.`)
};

export const batches_title = /** @type {(inputs: Batches_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Импорт журналы`)
};

export const brand_lockup = /** @type {(inputs: Brand_LockupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toraighyrov University`)
};

export const chart_axis_academic_year = /** @type {(inputs: Chart_Axis_Academic_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оқу жылы`)
};

export const chart_axis_active_reviewers = /** @type {(inputs: Chart_Axis_Active_ReviewersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белсенді пайдаланушылар саны`)
};

export const chart_axis_category = /** @type {(inputs: Chart_Axis_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Санат`)
};

export const chart_axis_count = /** @type {(inputs: Chart_Axis_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерулер саны`)
};

export const chart_axis_faculty = /** @type {(inputs: Chart_Axis_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет`)
};

export const chart_axis_month = /** @type {(inputs: Chart_Axis_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ай`)
};

export const chart_axis_originality = /** @type {(inputs: Chart_Axis_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірегейлік, %`)
};

export const chart_axis_share = /** @type {(inputs: Chart_Axis_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жалпы саннан үлесі, %`)
};

export const chart_axis_value = /** @type {(inputs: Chart_Axis_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мәні`)
};

export const chart_axis_work_type = /** @type {(inputs: Chart_Axis_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрі`)
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
	return /** @type {LocalizedString} */ (`95% және жоғары`)
};

export const chart_bucket_lt_50 = /** @type {(inputs: Chart_Bucket_Lt_50Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`50%-дан төмен`)
};

export const chart_data_table = /** @type {(inputs: Chart_Data_TableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректер кестесі`)
};

export const chart_dynamics_flags_title = /** @type {(inputs: Chart_Dynamics_Flags_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша эскалациялар және қайта тексерулер`)
};

export const chart_dynamics_title = /** @type {(inputs: Chart_Dynamics_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша тексерулер және орташа бірегейлік`)
};

export const chart_empty = /** @type {(inputs: Chart_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған сүзгілер бойынша деректер жоқ`)
};

export const chart_faculties_title = /** @type {(inputs: Chart_Faculties_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер бойынша көрсеткіштер`)
};

export const chart_heatmap_scale = /** @type {(inputs: Chart_Heatmap_ScaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Түс шкаласы: бағандағы ең кіші мәннен ең үлкен мәнге дейін`)
};

export const chart_heatmap_unit = /** @type {(inputs: Chart_Heatmap_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімше`)
};

export const chart_histogram_bucket = /** @type {(inputs: Chart_Histogram_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірегейлік ауқымы`)
};

export const chart_histogram_title = /** @type {(inputs: Chart_Histogram_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірегейлік ауқымдары бойынша тексерулер`)
};

export const chart_kpi_delta_down = /** @type {(inputs: Chart_Kpi_Delta_DownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.delta} төмендеу`)
};

export const chart_kpi_delta_flat = /** @type {(inputs: Chart_Kpi_Delta_FlatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`өзгеріссіз`)
};

export const chart_kpi_delta_up = /** @type {(inputs: Chart_Kpi_Delta_UpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.delta} өсім`)
};

export const chart_kpi_previous = /** @type {(inputs: Chart_Kpi_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`алдыңғы кезеңмен салыстырғанда`)
};

export const chart_kpi_sparkline = /** @type {(inputs: Chart_Kpi_SparklineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезең ішіндегі динамика`)
};

export const chart_legend = /** @type {(inputs: Chart_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шартты белгілер`)
};

export const chart_semester_autumn = /** @type {(inputs: Chart_Semester_AutumnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.year} күзгі семестрі`)
};

export const chart_semester_bands = /** @type {(inputs: Chart_Semester_BandsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Семестр шекаралары`)
};

export const chart_semester_shading = /** @type {(inputs: Chart_Semester_ShadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Көлеңкелеу - күзгі семестр`)
};

export const chart_semester_spring = /** @type {(inputs: Chart_Semester_SpringInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.year} көктемгі семестрі`)
};

export const chart_series_active_reviewers = /** @type {(inputs: Chart_Series_Active_ReviewersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белсенді пайдаланушылар`)
};

export const chart_series_checks = /** @type {(inputs: Chart_Series_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерулер`)
};

export const chart_series_escalated = /** @type {(inputs: Chart_Series_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалациялар`)
};

export const chart_series_originality = /** @type {(inputs: Chart_Series_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Орташа бірегейлік`)
};

export const chart_series_rechecks = /** @type {(inputs: Chart_Series_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексерулер`)
};

export const chart_suppressed_note = /** @type {(inputs: Chart_Suppressed_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Жасырылған мәндер: ${i?.total} ішінен ${i?.count} - деректер жеткіліксіз`)
};

export const chart_units_title = /** @type {(inputs: Chart_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер мен кафедралар бойынша көрсеткіштер`)
};

export const chart_usage_title = /** @type {(inputs: Chart_Usage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша белсенді пайдаланушылар`)
};

export const chart_work_types_counts = /** @type {(inputs: Chart_Work_Types_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері бойынша тексерулер`)
};

export const chart_work_types_originality = /** @type {(inputs: Chart_Work_Types_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері бойынша бірегейлік`)
};

export const confirm_delete = /** @type {(inputs: Confirm_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жазбаны жою керек пе? Әрекет қайтарылмайды.`)
};

export const confirm_revoke_role = /** @type {(inputs: Confirm_Revoke_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Осы рөлді тіркелгіден алып тастау керек пе?`)
};

export const confirm_unpublish_report = /** @type {(inputs: Confirm_Unpublish_ReportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есепті жарияланымнан алу керек пе? Ол ашық дашбордта қолжетімсіз болады.`)
};

export const dict_active = /** @type {(inputs: Dict_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белсенді`)
};

export const dict_active_no = /** @type {(inputs: Dict_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жоқ`)
};

export const dict_active_yes = /** @type {(inputs: Dict_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Иә`)
};

export const dict_code = /** @type {(inputs: Dict_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Коды`)
};

export const dict_code_hint = /** @type {(inputs: Dict_Code_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық жазбасының бірегей коды.`)
};

export const dict_entries = /** @type {(inputs: Dict_EntriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық жазбалары`)
};

export const dict_entries_hint = /** @type {(inputs: Dict_Entries_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бар кодпен қосу жазбаны ауыстырады.`)
};

export const dict_name_en = /** @type {(inputs: Dict_Name_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Атауы (EN)`)
};

export const dict_name_kk = /** @type {(inputs: Dict_Name_KkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Атауы (KK)`)
};

export const dict_name_ru = /** @type {(inputs: Dict_Name_RuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Атауы (RU)`)
};

export const dict_none = /** @type {(inputs: Dict_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық бос.`)
};

export const dict_parent = /** @type {(inputs: Dict_ParentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аталық бөлімше`)
};

export const dict_parent_none = /** @type {(inputs: Dict_Parent_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалмаған`)
};

export const dict_sort_order = /** @type {(inputs: Dict_Sort_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сұрыптау реті`)
};

export const dict_tab_departments = /** @type {(inputs: Dict_Tab_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедралар`)
};

export const dict_tab_faculties = /** @type {(inputs: Dict_Tab_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер`)
};

export const dict_tab_programs = /** @type {(inputs: Dict_Tab_ProgramsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Білім беру бағдарламалары`)
};

export const dict_tab_work_types = /** @type {(inputs: Dict_Tab_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері`)
};

export const embed_title = /** @type {(inputs: Embed_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Академиялық адалдық - виджет`)
};

export const error_out_of_scope = /** @type {(inputs: Error_Out_Of_ScopeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған бөлімше сіздің көріну аймағыңыздан тыс. Сүзгіні өзгертіңіз немесе әкімшіге хабарласыңыз.`)
};

export const error_role_denied = /** @type {(inputs: Error_Role_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сіздің рөліңіз бұл бөлімге қолжеткізуге мүмкіндік бермейді. Жүйе әкімшісіне хабарласыңыз.`)
};

export const error_session_expired = /** @type {(inputs: Error_Session_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сеанс аяқталды. Қайта кіріңіз.`)
};

export const escalations_units_note = /** @type {(inputs: Escalations_Units_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша бөліну рөлге қарамастан әрқашан k-анонимдік тексеруінен өтеді.`)
};

export const escalations_units_title = /** @type {(inputs: Escalations_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша эскалациялар`)
};

export const ethics_cases_empty = /** @type {(inputs: Ethics_Cases_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған кезеңдегі Этика кеңесінің тізілімі бос.`)
};

export const ethics_cases_title = /** @type {(inputs: Ethics_Cases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Этика кеңесінің тізілімі`)
};

export const ethics_category = /** @type {(inputs: Ethics_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бұзушылық санаты`)
};

export const ethics_closed = /** @type {(inputs: Ethics_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қаралды`)
};

export const ethics_referred = /** @type {(inputs: Ethics_ReferredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Берілді`)
};

export const ethics_year = /** @type {(inputs: Ethics_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оқу жылы`)
};

export const export_busy = /** @type {(inputs: Export_BusyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дайындалуда…`)
};

export const export_error = /** @type {(inputs: Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Файлды дайындау мүмкін болмады.`)
};

export const export_official_use = /** @type {(inputs: Export_Official_UseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қызметтік пайдалану үшін. Жүктеп алу фактісі журналға жазылады.`)
};

export const export_pdf = /** @type {(inputs: Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF экспорты`)
};

export const export_public_hint = /** @type {(inputs: Export_Public_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Файлда таңдалған кезеңнің сүзгілер ескерілген көрсеткіштері болады.`)
};

export const export_title = /** @type {(inputs: Export_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректерді жүктеп алу`)
};

export const export_xlsx = /** @type {(inputs: Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Excel экспорты`)
};

export const filter_all_departments = /** @type {(inputs: Filter_All_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық кафедралар`)
};

export const filter_all_faculties = /** @type {(inputs: Filter_All_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық факультеттер`)
};

export const filter_all_statuses = /** @type {(inputs: Filter_All_StatusesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық мәртебелер`)
};

export const filter_all_work_types = /** @type {(inputs: Filter_All_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыстың барлық түрлері`)
};

export const filter_bar_title = /** @type {(inputs: Filter_Bar_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сүзгілер`)
};

export const filter_department = /** @type {(inputs: Filter_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра`)
};

export const filter_faculty = /** @type {(inputs: Filter_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет`)
};

export const filter_from = /** @type {(inputs: Filter_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басталу күні`)
};

export const filter_period = /** @type {(inputs: Filter_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезең`)
};

export const filter_period_3y = /** @type {(inputs: Filter_Period_3yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`3 жыл`)
};

export const filter_period_5y = /** @type {(inputs: Filter_Period_5yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`5 жыл`)
};

export const filter_period_custom = /** @type {(inputs: Filter_Period_CustomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Еркін кезең`)
};

export const filter_period_month = /** @type {(inputs: Filter_Period_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ай`)
};

export const filter_period_semester = /** @type {(inputs: Filter_Period_SemesterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Семестр`)
};

export const filter_period_shown = /** @type {(inputs: Filter_Period_ShownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Көрсетілген кезең: ${i?.from} - ${i?.to}`)
};

export const filter_period_year = /** @type {(inputs: Filter_Period_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оқу жылы`)
};

export const filter_program = /** @type {(inputs: Filter_ProgramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Білім беру бағдарламасы`)
};

export const filter_program_hint = /** @type {(inputs: Filter_Program_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Білім беру бағдарламасының кодын енгізіңіз - тізімнен таңдау әзірге қолжетімсіз.`)
};

export const filter_program_placeholder = /** @type {(inputs: Filter_Program_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PROG01`)
};

export const filter_reset = /** @type {(inputs: Filter_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сүзгілерді тазалау`)
};

export const filter_status = /** @type {(inputs: Filter_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексеру мәртебесі`)
};

export const filter_to = /** @type {(inputs: Filter_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аяқталу күні`)
};

export const filter_work_type = /** @type {(inputs: Filter_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрі`)
};

export const footer_about_body = /** @type {(inputs: Footer_About_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дашборд Toraighyrov University-де жазба жұмыстарды алынған материалдарға тексеру бойынша дербестендірілмеген статистиканы жариялайды. Көрсеткіштер жиынтық түрде - университет, факультеттер және жұмыс түрлері бойынша беріледі; жекелеген авторлар мен жұмыстар туралы деректер жарияланбайды.`)
};

export const footer_about_title = /** @type {(inputs: Footer_About_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дашборд туралы`)
};

export const footer_sections_title = /** @type {(inputs: Footer_Sections_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімдер`)
};

export const footer_staff_link = /** @type {(inputs: Footer_Staff_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қызметкерлер үшін кіру`)
};

export const footer_updated = /** @type {(inputs: Footer_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректер тәулігіне кемінде бір рет жаңартылады.`)
};

export const form_error = /** @type {(inputs: Form_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сақтау мүмкін болмады`)
};

export const form_invalid_email = /** @type {(inputs: Form_Invalid_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дұрыс электрондық пошта мекенжайын көрсетіңіз`)
};

export const form_invalid_json = /** @type {(inputs: Form_Invalid_JsonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON дұрыс емес немесе құрылымы күтілгенге сәйкес келмейді`)
};

export const form_invalid_number = /** @type {(inputs: Form_Invalid_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бүтін теріс емес сан көрсетіңіз`)
};

export const form_required = /** @type {(inputs: Form_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Міндетті өріс`)
};

export const form_saved = /** @type {(inputs: Form_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сақталды`)
};

export const form_saving = /** @type {(inputs: Form_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сақталуда…`)
};

export const header_locale_label = /** @type {(inputs: Header_Locale_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Интерфейс тілі`)
};

export const header_skip_link = /** @type {(inputs: Header_Skip_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мазмұнға өту`)
};

export const initiator_other = /** @type {(inputs: Initiator_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өзге`)
};

export const initiator_registrar = /** @type {(inputs: Initiator_RegistrarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркеуші кеңсесі`)
};

export const initiator_rules_hint = /** @type {(inputs: Initiator_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушінің мекенжайы бойынша тексеруді бастамашының рөлін анықтайды.`)
};

export const initiator_rules_title = /** @type {(inputs: Initiator_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бастамашыны анықтау ережелері`)
};

export const initiator_staff_self = /** @type {(inputs: Initiator_Staff_SelfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ПОҚ (өзін-өзі тексеру)`)
};

export const initiator_student = /** @type {(inputs: Initiator_StudentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Студент`)
};

export const insufficient_data = /** @type {(inputs: Insufficient_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`деректер жеткіліксіз`)
};

export const internal_contour_title = /** @type {(inputs: Internal_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Антиплагиаттың ішкі аналитикасы`)
};

export const internal_nav_other = /** @type {(inputs: Internal_Nav_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басқа`)
};

export const internal_nav_public = /** @type {(inputs: Internal_Nav_PublicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ашық контур`)
};

export const internal_nav_sections = /** @type {(inputs: Internal_Nav_SectionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімдер`)
};

export const internal_nav_toggle = /** @type {(inputs: Internal_Nav_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мәзірді көрсету немесе жасыру`)
};

export const internal_overview_hint = /** @type {(inputs: Internal_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сіздің көріну аймағыңыз шегіндегі көрсеткіштер.`)
};

export const k_threshold_note = /** @type {(inputs: K_Threshold_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.k} тексеруден аз топтар жарияланбайды - мәннің орнына «деректер жеткіліксіз» деп көрсетіледі.`)
};

export const kpi_avg_originality = /** @type {(inputs: Kpi_Avg_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Орташа бірегейлік`)
};

export const kpi_avg_originality_hint = /** @type {(inputs: Kpi_Avg_Originality_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезеңдегі барлық тексерулер бойынша орташа мән`)
};

export const kpi_below_threshold = /** @type {(inputs: Kpi_Below_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шектен төмен жұмыстардың үлесі`)
};

export const kpi_below_threshold_hint = /** @type {(inputs: Kpi_Below_Threshold_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Шектен төмен тексерулер саны: ${i?.count}`)
};

export const kpi_coverage = /** @type {(inputs: Kpi_CoverageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерумен қамту`)
};

export const kpi_coverage_hint = /** @type {(inputs: Kpi_Coverage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексеруден өткен тапсырылған жұмыстардың үлесі`)
};

export const kpi_escalated = /** @type {(inputs: Kpi_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалациялар`)
};

export const kpi_escalated_hint = /** @type {(inputs: Kpi_Escalated_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белгісі алынбаған күдікті жұмыстар`)
};

export const kpi_escalated_share = /** @type {(inputs: Kpi_Escalated_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалация үлесі`)
};

export const kpi_escalated_share_hint = /** @type {(inputs: Kpi_Escalated_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезеңдегі тексерулер санынан`)
};

export const kpi_improved = /** @type {(inputs: Kpi_ImprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жақсарғаны`)
};

export const kpi_improved_share = /** @type {(inputs: Kpi_Improved_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жақсару үлесі`)
};

export const kpi_improved_share_hint = /** @type {(inputs: Kpi_Improved_Share_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Жақсарған жұмыстар: ${i?.count}`)
};

export const kpi_recheck_share = /** @type {(inputs: Kpi_Recheck_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексеру үлесі`)
};

export const kpi_recheck_share_hint = /** @type {(inputs: Kpi_Recheck_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыстардың жалпы санынан`)
};

export const kpi_total_checks = /** @type {(inputs: Kpi_Total_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық тексерулер`)
};

export const kpi_total_checks_hint = /** @type {(inputs: Kpi_Total_Checks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған кезең үшін`)
};

export const kpi_works_rechecked = /** @type {(inputs: Kpi_Works_RecheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексеруден өтті`)
};

export const kpi_works_rechecked_hint = /** @type {(inputs: Kpi_Works_Rechecked_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірден көп әрекеті бар жұмыстар`)
};

export const kpi_works_total = /** @type {(inputs: Kpi_Works_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық жұмыс`)
};

export const kpi_works_total_hint = /** @type {(inputs: Kpi_Works_Total_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезеңдегі бірегей жұмыстар`)
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
	return /** @type {LocalizedString} */ (`Логин немесе құпия сөз қате.`)
};

export const login_hint = /** @type {(inputs: Login_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүйе әкімшісі жасаған тіркелгімен кіріңіз.`)
};

export const login_no_account = /** @type {(inputs: Login_No_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркелгілерді жүйе әкімшісі жасайды. Кіру мүмкіндігі болмаса немесе құпия сөз ұмытылса - оған хабарласыңыз.`)
};

export const login_password = /** @type {(inputs: Login_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Құпия сөз`)
};

export const login_submit = /** @type {(inputs: Login_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кіру`)
};

export const login_throttled = /** @type {(inputs: Login_ThrottledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кіру әрекеті тым көп. Сәл күтіп, қайта көріңіз.`)
};

export const login_title = /** @type {(inputs: Login_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ішкі контурға кіру`)
};

export const login_username = /** @type {(inputs: Login_UsernameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Логин`)
};

export const logout_button = /** @type {(inputs: Logout_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шығу`)
};

export const not_found_title = /** @type {(inputs: Not_Found_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бет табылмады`)
};

export const public_contour_title = /** @type {(inputs: Public_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Академиялық адалдық - ашық статистика`)
};

export const rechecks_units_title = /** @type {(inputs: Rechecks_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша қайта тексерулер`)
};

export const report_files = /** @type {(inputs: Report_FilesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Файлдар`)
};

export const report_files_after_publish = /** @type {(inputs: Report_Files_After_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланғаннан кейін қолжетімді`)
};

export const report_generate = /** @type {(inputs: Report_GenerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есеп қалыптастыру`)
};

export const report_generate_hint = /** @type {(inputs: Report_Generate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдық есеп - 1 қыркүйектен 31 тамызға дейін; кезеңдік есеп - еркін күндер аралығы.`)
};

export const report_generated_at = /** @type {(inputs: Report_Generated_AtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қалыптастырылды`)
};

export const report_generated_ok = /** @type {(inputs: Report_Generated_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есеп қалыптастырылды`)
};

export const report_kind = /** @type {(inputs: Report_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есеп түрі`)
};

export const report_locale = /** @type {(inputs: Report_LocaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есеп тілі`)
};

export const report_none = /** @type {(inputs: Report_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есептер әлі қалыптастырылмаған.`)
};

export const report_period = /** @type {(inputs: Report_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезең`)
};

export const report_publish = /** @type {(inputs: Report_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жариялау`)
};

export const report_published = /** @type {(inputs: Report_PublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланған`)
};

export const report_published_state = /** @type {(inputs: Report_Published_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жариялану`)
};

export const report_unpublish = /** @type {(inputs: Report_UnpublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жариялаудан алу`)
};

export const report_unpublished = /** @type {(inputs: Report_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланбаған`)
};

export const reports_download = /** @type {(inputs: Reports_DownloadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.format} жүктеп алу`)
};

export const reports_empty = /** @type {(inputs: Reports_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есептер әлі жарияланған жоқ.`)
};

export const reports_generated = /** @type {(inputs: Reports_GeneratedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date} жасалды`)
};

export const reports_kind_annual = /** @type {(inputs: Reports_Kind_AnnualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдық есеп`)
};

export const reports_kind_manual = /** @type {(inputs: Reports_Kind_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезеңдік есеп`)
};

export const request_access_account = /** @type {(inputs: Request_Access_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сіздің тіркелгіңіз`)
};

export const request_access_back = /** @type {(inputs: Request_Access_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ашық статистикаға оралу`)
};

export const request_access_body = /** @type {(inputs: Request_Access_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сіз жүйеге кірдіңіз, бірақ тіркелгіңізде ішкі контурға құқық жоқ. Қолжетімділік бөлімше басшысының өтініші бойынша, жүйе әкімшісімен келісіліп беріледі.`)
};

export const request_access_staff_note = /** @type {(inputs: Request_Access_Staff_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«ПОҚ» рөлі ашық контурға қолжетімділік береді. Кафедра бойынша толық деректер үшін бөлек рөл қажет.`)
};

export const request_access_step_admin = /** @type {(inputs: Request_Access_Step_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүйе әкімшісі рөл мен көріну аймағын - факультет немесе кафедра - береді.`)
};

export const request_access_step_head = /** @type {(inputs: Request_Access_Step_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімше басшысы қолжетімділікке өтініш жібереді.`)
};

export const request_access_step_signin = /** @type {(inputs: Request_Access_Step_SigninInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл берілгеннен кейін қайта кіріңіз - бөлім ашылады.`)
};

export const request_access_title = /** @type {(inputs: Request_Access_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ішкі контурға қолжетімділік берілмеген`)
};

export const role_admin = /** @type {(inputs: Role_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әкімші`)
};

export const role_compliance = /** @type {(inputs: Role_ComplianceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Комплаенс қызметі`)
};

export const role_dean = /** @type {(inputs: Role_DeanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Декан`)
};

export const role_dept_head = /** @type {(inputs: Role_Dept_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра меңгерушісі`)
};

export const role_ethics = /** @type {(inputs: Role_EthicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Этика жөніндегі уәкіл`)
};

export const role_none = /** @type {(inputs: Role_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл берілмеген`)
};

export const role_staff = /** @type {(inputs: Role_StaffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ПОҚ`)
};

export const roles_account = /** @type {(inputs: Roles_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркелгі`)
};

export const roles_active = /** @type {(inputs: Roles_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Күйі`)
};

export const roles_active_no = /** @type {(inputs: Roles_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өшірілген`)
};

export const roles_active_yes = /** @type {(inputs: Roles_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белсенді`)
};

export const roles_grant = /** @type {(inputs: Roles_GrantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл беру`)
};

export const roles_grant_hint = /** @type {(inputs: Roles_Grant_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деканға факультет коды, кафедра меңгерушісіне кафедра коды қажет.`)
};

export const roles_grant_submit = /** @type {(inputs: Roles_Grant_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Беру`)
};

export const roles_grants = /** @type {(inputs: Roles_GrantsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Берілген рөлдер`)
};

export const roles_none = /** @type {(inputs: Roles_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркелгілер жоқ.`)
};

export const roles_revoke = /** @type {(inputs: Roles_RevokeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөлді қайтарып алу`)
};

export const roles_role = /** @type {(inputs: Roles_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл`)
};

export const roles_scope_department = /** @type {(inputs: Roles_Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аймақ: кафедра`)
};

export const roles_scope_department_required = /** @type {(inputs: Roles_Scope_Department_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра меңгерушісі үшін міндетті`)
};

export const roles_scope_faculty = /** @type {(inputs: Roles_Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аймақ: факультет`)
};

export const roles_scope_faculty_required = /** @type {(inputs: Roles_Scope_Faculty_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Декан үшін міндетті`)
};

export const roles_scope_none = /** @type {(inputs: Roles_Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шектеусіз`)
};

export const roles_subject = /** @type {(inputs: Roles_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`SSO идентификаторы`)
};

export const rule_activate = /** @type {(inputs: Rule_ActivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қосу`)
};

export const rule_active = /** @type {(inputs: Rule_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белсенді`)
};

export const rule_deactivate = /** @type {(inputs: Rule_DeactivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өшіру`)
};

export const rule_initiator = /** @type {(inputs: Rule_InitiatorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бастамашы`)
};

export const rule_none = /** @type {(inputs: Rule_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ережелер белгіленбеген.`)
};

export const rule_pattern = /** @type {(inputs: Rule_PatternInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Үлгі`)
};

export const rule_pattern_hint = /** @type {(inputs: Rule_Pattern_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыстың нормаланған атауынан ізделетін ішкі жол.`)
};

export const rule_priority = /** @type {(inputs: Rule_PriorityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басымдық`)
};

export const rule_priority_hint = /** @type {(inputs: Rule_Priority_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кіші мән бұрын қолданылады.`)
};

export const rule_regex_hint = /** @type {(inputs: Rule_Regex_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушінің нормаланған мекенжайы бойынша тұрақты өрнек.`)
};

export const rule_work_type = /** @type {(inputs: Rule_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрі`)
};

export const scope_all = /** @type {(inputs: Scope_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бүкіл университет`)
};

export const scope_department = /** @type {(inputs: Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра шегінде`)
};

export const scope_faculty = /** @type {(inputs: Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет шегінде`)
};

export const scope_none = /** @type {(inputs: Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аймақ белгіленбеген`)
};

export const section_dynamics = /** @type {(inputs: Section_DynamicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Уақыт бойынша динамика`)
};

export const section_dynamics_hint = /** @type {(inputs: Section_Dynamics_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша тексерулер саны және орташа бірегейлік.`)
};

export const section_error_title = /** @type {(inputs: Section_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімді жүктеу мүмкін болмады`)
};

export const section_error_unavailable = /** @type {(inputs: Section_Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қызмет уақытша қолжетімсіз.`)
};

export const section_escalations = /** @type {(inputs: Section_EscalationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалациялар`)
};

export const section_escalations_hint = /** @type {(inputs: Section_Escalations_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Этика кеңесіне берілген істердің жиынтық санауыштары, дербес деректерсіз.`)
};

export const section_faculties = /** @type {(inputs: Section_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер бойынша`)
};

export const section_faculties_hint = /** @type {(inputs: Section_Faculties_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер мен институттар бойынша жиынтық көрсеткіштер.`)
};

export const section_histogram = /** @type {(inputs: Section_HistogramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірегейлік үлестірімі`)
};

export const section_histogram_hint = /** @type {(inputs: Section_Histogram_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерулердің бірегейлік көрсеткішінің ауқымдары бойынша үлестірімі.`)
};

export const section_in_development = /** @type {(inputs: Section_In_DevelopmentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.section} - әзірленуде`)
};

export const section_loading = /** @type {(inputs: Section_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректер жүктелуде`)
};

export const section_overview = /** @type {(inputs: Section_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шолу қорытындысы`)
};

export const section_overview_hint = /** @type {(inputs: Section_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған кезеңнің негізгі көрсеткіштері және бір жыл бұрынғы дәл сол кезеңмен салыстырғандағы өзгерісі.`)
};

export const section_rechecks = /** @type {(inputs: Section_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексерулер`)
};

export const section_rechecks_hint = /** @type {(inputs: Section_Rechecks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пысықтаудан кейін қайта тексеруден өткен жұмыстар үлесі және көрсеткіші жақсарғандарының үлесі.`)
};

export const section_reports = /** @type {(inputs: Section_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланған есептер`)
};

export const section_reports_hint = /** @type {(inputs: Section_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдық және кезеңдік дербестендірілмеген есептер.`)
};

export const section_retry = /** @type {(inputs: Section_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайталау`)
};

export const section_role_restricted = /** @type {(inputs: Section_Role_RestrictedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлім Этика кеңесі мен Комплаенс қызметіне қолжетімді. Ол сізге жұмыс бойынша қажет болса, жүйе әкімшісіне хабарласыңыз.`)
};

export const section_units = /** @type {(inputs: Section_UnitsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер мен кафедралар бойынша`)
};

export const section_units_hint = /** @type {(inputs: Section_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедраларға дейін ашылатын факультеттер бойынша көрсеткіштер.`)
};

export const section_usage = /** @type {(inputs: Section_UsageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүйені пайдалану`)
};

export const section_usage_hint = /** @type {(inputs: Section_Usage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша белсенді пайдаланушылар және тексерудің орташа уақыты.`)
};

export const section_work_types = /** @type {(inputs: Section_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері бойынша`)
};

export const section_work_types_hint = /** @type {(inputs: Section_Work_Types_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жазба жұмыстардың түрлері бойынша тексерулер және орташа бірегейлік.`)
};

export const section_yoy = /** @type {(inputs: Section_YoyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдан жылға`)
};

export const section_yoy_hint = /** @type {(inputs: Section_Yoy_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Көрсеткіштерді оқу жылдары бойынша салыстыру (1 қыркүйек - 31 тамыз).`)
};

export const setting_autumn_start = /** @type {(inputs: Setting_Autumn_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Күзгі семестрдің басы`)
};

export const setting_exclude_deleted = /** @type {(inputs: Setting_Exclude_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жойылған құжаттарды қоспау`)
};

export const setting_exclude_deleted_hint = /** @type {(inputs: Setting_Exclude_Deleted_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«Жойылған» белгісі бар жазбалар жиынтықтарға кірмейді.`)
};

export const setting_histogram_buckets = /** @type {(inputs: Setting_Histogram_BucketsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Түпнұсқалық ауқымдарының шекаралары`)
};

export const setting_histogram_buckets_hint = /** @type {(inputs: Setting_Histogram_Buckets_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пайыздар үтір арқылы өсу ретімен, мысалы 50, 70, 85, 95.`)
};

export const setting_histogram_buckets_invalid = /** @type {(inputs: Setting_Histogram_Buckets_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шекаралар 0-ден 100-ге дейінгі ауқымда өсу ретімен болуы тиіс`)
};

export const setting_k_threshold = /** @type {(inputs: Setting_K_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`k-анонимдік шегі`)
};

export const setting_k_threshold_hint = /** @type {(inputs: Setting_K_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`k-дан аз бақылауы бар топтар жарияланбайды. Ұсынылатын мән - 5.`)
};

export const setting_originality_threshold = /** @type {(inputs: Setting_Originality_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Түпнұсқалық шегі, %`)
};

export const setting_originality_threshold_hint = /** @type {(inputs: Setting_Originality_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шектен төмен жұмыстар назар аударуды талап етеді деп саналады. Әдепкі мән - 70.`)
};

export const setting_semester_hint = /** @type {(inputs: Setting_Semester_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пішімі АА-КК.`)
};

export const setting_snapshot_quarter = /** @type {(inputs: Setting_Snapshot_QuarterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кесінді жариялау тоқсаны`)
};

export const setting_snapshot_quarter_hint = /** @type {(inputs: Setting_Snapshot_Quarter_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«auto» - ішкі контурды жаңартумен бірге.`)
};

export const setting_spring_start = /** @type {(inputs: Setting_Spring_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Көктемгі семестрдің басы`)
};

export const setting_status_rules = /** @type {(inputs: Setting_Status_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мәртебені анықтау ережелері`)
};

export const setting_status_rules_hint = /** @type {(inputs: Setting_Status_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON: default, escalate_when және status/when жұптарынан тұратын rules тізімі.`)
};

export const settings_save = /** @type {(inputs: Settings_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Баптауларды сақтау`)
};

export const settings_saved_hint = /** @type {(inputs: Settings_Saved_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API жауаптарының кэші тазаланды - өзгерістер бірден көрінеді.`)
};

export const settings_unchanged = /** @type {(inputs: Settings_UnchangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өзгеріс жоқ`)
};

export const settings_updated = /** @type {(inputs: Settings_UpdatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Соңғы өзгеріс: ${i?.date}, ${i?.who}`)
};

export const settings_updated_by_system = /** @type {(inputs: Settings_Updated_By_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`жүйе`)
};

export const source_base_url = /** @type {(inputs: Source_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дереккөз мекенжайы`)
};

export const source_base_url_hint = /** @type {(inputs: Source_Base_Url_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API үшін негізгі URL немесе CSV үшін каталог.`)
};

export const source_cursor = /** @type {(inputs: Source_CursorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Курсор`)
};

export const source_cursor_absent = /** @type {(inputs: Source_Cursor_AbsentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`белгіленбеген`)
};

export const source_cursor_present = /** @type {(inputs: Source_Cursor_PresentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`белгіленген`)
};

export const source_disable = /** @type {(inputs: Source_DisableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өшіру`)
};

export const source_enable = /** @type {(inputs: Source_EnableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қосу`)
};

export const source_enabled = /** @type {(inputs: Source_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Күйі`)
};

export const source_enabled_no = /** @type {(inputs: Source_Enabled_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өшірілген`)
};

export const source_enabled_yes = /** @type {(inputs: Source_Enabled_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қосулы`)
};

export const source_kind = /** @type {(inputs: Source_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Түрі`)
};

export const source_kind_api = /** @type {(inputs: Source_Kind_ApiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`REST API`)
};

export const source_kind_csv = /** @type {(inputs: Source_Kind_CsvInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CSV файлдары`)
};

export const source_none = /** @type {(inputs: Source_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дереккөздер бапталмаған.`)
};

export const source_run = /** @type {(inputs: Source_RunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Импортты іске қосу`)
};

export const source_run_started = /** @type {(inputs: Source_Run_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүктеме іске қосылды - импорт журналын қадағалаңыз.`)
};

export const source_schedule = /** @type {(inputs: Source_ScheduleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кесте`)
};

export const source_schedule_hint = /** @type {(inputs: Source_Schedule_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cron өрнегі; бос болса - тек қолмен іске қосу.`)
};

export const staff_unit_email = /** @type {(inputs: Staff_Unit_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушінің электрондық поштасы`)
};

export const staff_unit_email_hint = /** @type {(inputs: Staff_Unit_Email_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мекенжай сақталмайды және журналға жазылмайды: сервер тек қайтымсыз хэш пен масканы сақтайды.`)
};

export const staff_unit_masked = /** @type {(inputs: Staff_Unit_MaskedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мекенжай маскасы`)
};

export const staff_unit_none = /** @type {(inputs: Staff_Unit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сәйкестіктер белгіленбеген.`)
};

export const staff_unit_updated = /** @type {(inputs: Staff_Unit_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жаңартылды`)
};

export const staff_units_hint = /** @type {(inputs: Staff_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушіні факультет пен кафедраға байланыстырады - бөлімшелер бойынша бөліну осыған негізделеді.`)
};

export const staff_units_title = /** @type {(inputs: Staff_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушілер мен бөлімшелер`)
};

export const status_accepted = /** @type {(inputs: Status_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қабылданды`)
};

export const status_needs_revision = /** @type {(inputs: Status_Needs_RevisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пысықтауға жіберілді`)
};

export const status_recheck = /** @type {(inputs: Status_RecheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексеру`)
};

export const status_rejected = /** @type {(inputs: Status_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қабылданбады`)
};

export const table_actions = /** @type {(inputs: Table_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әрекеттер`)
};

export const units_coverage_footnote = /** @type {(inputs: Units_Coverage_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша бөлініс тексерушілер мен бөлімшелердің ағымдағы сәйкестігі бойынша құрылған; өткен оқу жылдары үшін ол шамамен алынған.`)
};

export const units_margin_footnote = /** @type {(inputs: Units_Margin_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет бойынша қорытынды k-анонимдік ережесімен жасырылған кафедраларды да қамтиды, сондықтан жолдар қосындысы қорытындымен сәйкес келмеуі мүмкін.`)
};

export const units_own_scope_only = /** @type {(inputs: Units_Own_Scope_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөліну қолжетімсіз: сіздің көріну аймағыңыз - бір бөлімше, оның көрсеткіштері жоғарыда келтірілген.`)
};

export const units_pending_mapping_footnote = /** @type {(inputs: Units_Pending_Mapping_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша бөлініс тексерушілер мен бөлімшелердің сәйкестігі жүктелгеннен кейін қолжетімді болады.`)
};

export const units_program_footnote = /** @type {(inputs: Units_Program_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Білім беру бағдарламалары бойынша бөлініс әзірге қолжетімсіз.`)
};

export const units_unassigned_footnote = /** @type {(inputs: Units_Unassigned_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«Бөлінбеген» - тексерушінің бөлімшесі сәйкестендірілмеген тексерулер.`)
};

export const usage_avg_duration = /** @type {(inputs: Usage_Avg_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерудің орташа уақыты`)
};

export const usage_avg_duration_hint = /** @type {(inputs: Usage_Avg_Duration_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Комплаенс қызметі қолмен толтырады; бастапқы жүйенің жүктемесінде бұл көрсеткіш жоқ.`)
};

export const usage_no_data = /** @type {(inputs: Usage_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`деректер жоқ`)
};

export const usage_seconds = /** @type {(inputs: Usage_SecondsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} с`)
};

export const work_type_rules_hint = /** @type {(inputs: Work_Type_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Құжат атауы бойынша жұмыс түрін анықтайды.`)
};

export const work_type_rules_title = /** @type {(inputs: Work_Type_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрін анықтау ережелері`)
};

export const work_types_single_bucket = /** @type {(inputs: Work_Types_Single_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері бойынша бөлініс қолжетімсіз: бастапқы жүйенің жүктемесінде жұмыс түрі өрісі жоқ, ал құжат атауы бойынша тексерулердің бір пайызынан азы анықталады. Қалғанының бәрі «өзге» түріне жатқызылған.`)
};