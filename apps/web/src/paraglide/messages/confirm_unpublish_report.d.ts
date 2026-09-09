/**
* | output |
* | --- |
* | "Unpublish this report? It will no longer be available on the public dashboard." |
*
* @param {Confirm_Unpublish_ReportInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_unpublish_report: ((inputs?: Confirm_Unpublish_ReportInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Confirm_Unpublish_ReportInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Confirm_Unpublish_ReportInputs = {};
