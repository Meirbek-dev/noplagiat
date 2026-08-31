/**
* | output |
* | --- |
* | "The report has been generated" |
*
* @param {Report_Generated_OkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generated_ok: ((inputs?: Report_Generated_OkInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_Generated_OkInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Report_Generated_OkInputs = {};
