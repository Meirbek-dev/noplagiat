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
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Scope_DepartmentInputs = {};
