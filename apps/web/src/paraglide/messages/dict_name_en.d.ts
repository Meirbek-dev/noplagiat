/**
* | output |
* | --- |
* | "Name (EN)" |
*
* @param {Dict_Name_EnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_en: ((inputs?: Dict_Name_EnInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Name_EnInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_Name_EnInputs = {};
