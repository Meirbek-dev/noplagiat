/**
* | output |
* | --- |
* | "PROG01" |
*
* @param {Filter_Program_PlaceholderInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program_placeholder: ((inputs?: Filter_Program_PlaceholderInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Program_PlaceholderInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_Program_PlaceholderInputs = {};
