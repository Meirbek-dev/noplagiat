/**
* | output |
* | --- |
* | "Enable" |
*
* @param {Rule_ActivateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_activate: ((inputs?: Rule_ActivateInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_ActivateInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Rule_ActivateInputs = {};
