/**
* | output |
* | --- |
* | "Aggregated figures per faculty and institute." |
*
* @param {Section_Faculties_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_faculties_hint: ((inputs?: Section_Faculties_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Faculties_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Faculties_HintInputs = {};
