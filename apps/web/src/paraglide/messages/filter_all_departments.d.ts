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
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_All_DepartmentsInputs = {};
