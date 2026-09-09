/**
* | output |
* | --- |
* | "Regular expression over the normalized reviewer address." |
*
* @param {Rule_Regex_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_regex_hint: ((inputs?: Rule_Regex_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_Regex_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Rule_Regex_HintInputs = {};
