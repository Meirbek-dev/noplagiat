/**
* | output |
* | --- |
* | "Accounts and the roles and scopes granted to them." |
*
* @param {Admin_Roles_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_roles_hint: ((inputs?: Admin_Roles_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Roles_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Roles_HintInputs = {};
