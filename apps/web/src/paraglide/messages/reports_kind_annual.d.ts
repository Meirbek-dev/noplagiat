/**
* | output |
* | --- |
* | "Annual report" |
*
* @param {Reports_Kind_AnnualInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_kind_annual: ((inputs?: Reports_Kind_AnnualInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Reports_Kind_AnnualInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reports_Kind_AnnualInputs = {};
