/**
* | output |
* | --- |
* | "No" |
*
* @param {Dict_Active_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active_no: ((inputs?: Dict_Active_NoInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Active_NoInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_Active_NoInputs = {};
