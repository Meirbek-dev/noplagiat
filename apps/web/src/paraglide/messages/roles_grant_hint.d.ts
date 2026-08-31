/**
* | output |
* | --- |
* | "A dean needs a faculty code, a head of department a department code." |
*
* @param {Roles_Grant_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant_hint: ((inputs?: Roles_Grant_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Roles_Grant_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Roles_Grant_HintInputs = {};
