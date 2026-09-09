/**
* | output |
* | --- |
* | "Name (KK)" |
*
* @param {Dict_Name_KkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_kk: ((inputs?: Dict_Name_KkInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Name_KkInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_Name_KkInputs = {};
