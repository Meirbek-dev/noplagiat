/**
* | output |
* | --- |
* | "Enter the study-programme code - picking from a list is not available yet." |
*
* @param {Filter_Program_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program_hint: ((inputs?: Filter_Program_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Program_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_Program_HintInputs = {};
