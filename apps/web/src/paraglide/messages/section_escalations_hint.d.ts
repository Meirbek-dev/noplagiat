/**
* | output |
* | --- |
* | "Aggregated counters of cases referred to the Ethics Council, with no personal data." |
*
* @param {Section_Escalations_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_escalations_hint: ((inputs?: Section_Escalations_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Escalations_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Escalations_HintInputs = {};
