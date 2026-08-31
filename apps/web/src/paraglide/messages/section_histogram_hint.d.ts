/**
* | output |
* | --- |
* | "How checks are distributed across the originality bands." |
*
* @param {Section_Histogram_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_histogram_hint: ((inputs?: Section_Histogram_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Histogram_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Histogram_HintInputs = {};
