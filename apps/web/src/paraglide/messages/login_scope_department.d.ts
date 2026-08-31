/**
* | output |
* | --- |
* | "Department code" |
*
* @param {Login_Scope_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_scope_department: ((inputs?: Login_Scope_DepartmentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_Scope_DepartmentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Login_Scope_DepartmentInputs = {};
