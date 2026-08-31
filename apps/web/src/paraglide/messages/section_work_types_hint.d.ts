/**
* | output |
* | --- |
* | "Checks and average originality broken down by type of written work." |
*
* @param {Section_Work_Types_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_work_types_hint: ((inputs?: Section_Work_Types_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Work_Types_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Work_Types_HintInputs = {};
