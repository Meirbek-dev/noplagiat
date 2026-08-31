/**
* | output |
* | --- |
* | "This deployment uses the portal's single sign-on." |
*
* @param {Login_Dev_UnavailableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_dev_unavailable: ((inputs?: Login_Dev_UnavailableInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_Dev_UnavailableInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Login_Dev_UnavailableInputs = {};
