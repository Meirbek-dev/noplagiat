/**
* | output |
* | --- |
* | "Every access to the internal contour: who, when, which section, and with which filters." |
*
* @param {Admin_Audit_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_audit_hint: ((inputs?: Admin_Audit_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Audit_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Audit_HintInputs = {};
