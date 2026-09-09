/**
* | output |
* | --- |
* | "Grant" |
*
* @param {Roles_Grant_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant_submit: ((inputs?: Roles_Grant_SubmitInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Grant_SubmitInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Roles_Grant_SubmitInputs = {};
