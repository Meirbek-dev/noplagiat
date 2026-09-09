/**
* | output |
* | --- |
* | "The share of works rechecked after revision, and how many of them improved." |
*
* @param {Section_Rechecks_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_rechecks_hint: ((inputs?: Section_Rechecks_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Rechecks_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Rechecks_HintInputs = {};
