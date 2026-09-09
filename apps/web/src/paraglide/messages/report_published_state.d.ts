/**
* | output |
* | --- |
* | "Publication" |
*
* @param {Report_Published_StateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_published_state: ((inputs?: Report_Published_StateInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_Published_StateInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Report_Published_StateInputs = {};
