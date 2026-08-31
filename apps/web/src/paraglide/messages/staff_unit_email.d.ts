/**
* | output |
* | --- |
* | "Reviewer e-mail" |
*
* @param {Staff_Unit_EmailInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_email: ((inputs?: Staff_Unit_EmailInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Unit_EmailInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Staff_Unit_EmailInputs = {};
