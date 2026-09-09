/**
* | output |
* | --- |
* | "Accounts are created by the system administrator. Ask them if you have no sign-in or have forgotten your password." |
*
* @param {Login_No_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_no_account: ((inputs?: Login_No_AccountInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_No_AccountInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Login_No_AccountInputs = {};
