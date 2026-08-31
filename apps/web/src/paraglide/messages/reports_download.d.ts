/**
* | output |
* | --- |
* | "Download {format}" |
*
* @param {Reports_DownloadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_download: ((inputs: Reports_DownloadInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Reports_DownloadInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reports_DownloadInputs = {
    format: NonNullable<unknown>;
};
