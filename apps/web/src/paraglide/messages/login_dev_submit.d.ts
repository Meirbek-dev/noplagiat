/**
* | output |
* | --- |
* | "Sign in (development)" |
*
* @param {Login_Dev_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_dev_submit: ((inputs?: Login_Dev_SubmitInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_Dev_SubmitInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Login_Dev_SubmitInputs = {};
