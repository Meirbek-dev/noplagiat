/**
* | output |
* | --- |
* | "Sign in with SSO" |
*
* @param {Login_Sso_ButtonInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_sso_button: ((inputs?: Login_Sso_ButtonInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_Sso_ButtonInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Login_Sso_ButtonInputs = {};
