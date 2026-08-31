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
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_Tab_DepartmentsInputs = {};
