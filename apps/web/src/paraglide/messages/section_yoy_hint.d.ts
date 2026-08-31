/**
* | output |
* | --- |
* | "The figures compared by academic year (1 September - 31 August)." |
*
* @param {Section_Yoy_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_yoy_hint: ((inputs?: Section_Yoy_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Yoy_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Yoy_HintInputs = {};
