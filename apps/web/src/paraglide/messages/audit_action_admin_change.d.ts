/**
* | output |
* | --- |
* | "Admin change" |
*
* @param {Audit_Action_Admin_ChangeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_admin_change: ((inputs?: Audit_Action_Admin_ChangeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_Action_Admin_ChangeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Audit_Action_Admin_ChangeInputs = {};
