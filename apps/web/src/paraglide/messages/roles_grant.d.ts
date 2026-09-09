/**
* | output |
* | --- |
* | "Grant a role" |
*
* @param {Roles_GrantInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant: ((inputs?: Roles_GrantInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_GrantInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Roles_GrantInputs = {};
