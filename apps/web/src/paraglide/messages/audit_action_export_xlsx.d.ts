/**
* | output |
* | --- |
* | "Excel export" |
*
* @param {Audit_Action_Export_XlsxInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_export_xlsx: ((inputs?: Audit_Action_Export_XlsxInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_Action_Export_XlsxInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Audit_Action_Export_XlsxInputs = {};
