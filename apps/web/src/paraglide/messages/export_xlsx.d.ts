/**
* | output |
* | --- |
* | "Export Excel" |
*
* @param {Export_XlsxInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_xlsx: ((inputs?: Export_XlsxInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_XlsxInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Export_XlsxInputs = {};
