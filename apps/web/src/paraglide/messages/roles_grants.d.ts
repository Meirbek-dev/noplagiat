/**
* | output |
* | --- |
* | "Grants" |
*
* @param {Roles_GrantsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grants: ((inputs?: Roles_GrantsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_GrantsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Roles_GrantsInputs = {};
