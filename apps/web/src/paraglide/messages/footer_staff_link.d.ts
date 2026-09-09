/**
* | output |
* | --- |
* | "Staff sign-in" |
*
* @param {Footer_Staff_LinkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_staff_link: ((inputs?: Footer_Staff_LinkInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Footer_Staff_LinkInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Footer_Staff_LinkInputs = {};
