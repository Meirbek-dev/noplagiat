/**
* | output |
* | --- |
* | "Derive the work type from the document title." |
*
* @param {Work_Type_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_type_rules_hint: ((inputs?: Work_Type_Rules_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Work_Type_Rules_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Work_Type_Rules_HintInputs = {};
