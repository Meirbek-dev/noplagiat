/**
* | output |
* | --- |
* | "Faculty metrics, expandable to departments." |
*
* @param {Section_Units_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_units_hint: ((inputs?: Section_Units_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Units_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Units_HintInputs = {};
