/**
* | output |
* | --- |
* | "Available once published" |
*
* @param {Report_Files_After_PublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_files_after_publish: ((inputs?: Report_Files_After_PublishInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_Files_After_PublishInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Report_Files_After_PublishInputs = {};
