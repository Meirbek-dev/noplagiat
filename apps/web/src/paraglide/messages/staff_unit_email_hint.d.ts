/**
* | output |
* | --- |
* | "The address is neither stored nor logged: the server keeps only an irreversible hash and a mask." |
*
* @param {Staff_Unit_Email_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_email_hint: ((inputs?: Staff_Unit_Email_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Unit_Email_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Staff_Unit_Email_HintInputs = {};
