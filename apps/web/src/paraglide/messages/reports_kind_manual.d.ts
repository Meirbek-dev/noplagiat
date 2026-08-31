/**
* | output |
* | --- |
* | "Period report" |
*
* @param {Reports_Kind_ManualInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_kind_manual: ((inputs?: Reports_Kind_ManualInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Reports_Kind_ManualInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reports_Kind_ManualInputs = {};
