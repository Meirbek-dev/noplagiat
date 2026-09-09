/**
* | output |
* | --- |
* | "View" |
*
* @param {Audit_Action_ViewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_view: ((inputs?: Audit_Action_ViewInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_Action_ViewInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Audit_Action_ViewInputs = {};
