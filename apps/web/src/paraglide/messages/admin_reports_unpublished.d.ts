/**
* | output |
* | --- |
* | "Unpublished reports" |
*
* @param {Admin_Reports_UnpublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports_unpublished: ((inputs?: Admin_Reports_UnpublishedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Reports_UnpublishedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Reports_UnpublishedInputs = {};
