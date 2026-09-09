/**
* | output |
* | --- |
* | "Active" |
*
* @param {Rule_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_active: ((inputs?: Rule_ActiveInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_ActiveInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Rule_ActiveInputs = {};
