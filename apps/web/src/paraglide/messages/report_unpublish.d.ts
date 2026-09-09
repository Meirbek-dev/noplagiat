/**
* | output |
* | --- |
* | "Unpublish" |
*
* @param {Report_UnpublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_unpublish: ((inputs?: Report_UnpublishInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_UnpublishInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Report_UnpublishInputs = {};
