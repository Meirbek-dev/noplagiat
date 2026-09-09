/**
* | output |
* | --- |
* | "Originality distribution" |
*
* @param {Section_HistogramInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_histogram: ((inputs?: Section_HistogramInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_HistogramInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_HistogramInputs = {};
