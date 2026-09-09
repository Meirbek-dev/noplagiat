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
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Role_Dept_HeadInputs = {};
