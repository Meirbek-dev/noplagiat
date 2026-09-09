/**
* | output |
* | --- |
* | "Revoke this role from the account?" |
*
* @param {Confirm_Revoke_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_revoke_role: ((inputs?: Confirm_Revoke_RoleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Confirm_Revoke_RoleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Confirm_Revoke_RoleInputs = {};
