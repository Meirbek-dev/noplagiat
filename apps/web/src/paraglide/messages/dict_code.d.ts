/**
* | output |
* | --- |
* | "Code" |
*
* @param {Dict_CodeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_code: ((inputs?: Dict_CodeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_CodeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_CodeInputs = {};
