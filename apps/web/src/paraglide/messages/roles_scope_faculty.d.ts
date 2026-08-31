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
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Roles_Scope_FacultyInputs = {};
