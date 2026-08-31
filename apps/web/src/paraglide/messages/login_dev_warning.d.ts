/**
* | output |
* | --- |
* | "Mints a session without SSO. Development and tests only; unavailable on a real deployment." |
*
* @param {Login_Dev_WarningInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_dev_warning: ((inputs?: Login_Dev_WarningInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_Dev_WarningInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Login_Dev_WarningInputs = {};
