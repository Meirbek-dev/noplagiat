/**
* | output |
* | --- |
* | "Immutable report snapshots. Publishing puts the file on the public contour." |
*
* @param {Admin_Reports_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports_hint: ((inputs?: Admin_Reports_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Reports_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Reports_HintInputs = {};
