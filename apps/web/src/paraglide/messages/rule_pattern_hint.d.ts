/**
* | output |
* | --- |
* | "Substring matched against the normalized work title." |
*
* @param {Rule_Pattern_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_pattern_hint: ((inputs?: Rule_Pattern_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_Pattern_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Rule_Pattern_HintInputs = {};
