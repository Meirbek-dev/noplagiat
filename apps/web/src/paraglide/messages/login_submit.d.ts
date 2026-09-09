/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Login_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_submit: ((inputs?: Login_SubmitInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_SubmitInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Login_SubmitInputs = {};
