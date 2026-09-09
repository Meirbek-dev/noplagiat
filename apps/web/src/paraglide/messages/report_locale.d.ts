/**
* | output |
* | --- |
* | "Report language" |
*
* @param {Report_LocaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_locale: ((inputs?: Report_LocaleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_LocaleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Report_LocaleInputs = {};
