/**
* | output |
* | --- |
* | "Login name" |
*
* @param {Login_UsernameInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_username: ((inputs?: Login_UsernameInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_UsernameInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Login_UsernameInputs = {};
