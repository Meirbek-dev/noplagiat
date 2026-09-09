/**
* | output |
* | --- |
* | "The dictionary is empty." |
*
* @param {Dict_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_none: ((inputs?: Dict_NoneInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_NoneInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_NoneInputs = {};
