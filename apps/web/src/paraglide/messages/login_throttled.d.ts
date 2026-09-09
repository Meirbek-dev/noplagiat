/**
* | output |
* | --- |
* | "Too many sign-in attempts. Wait a moment and try again." |
*
* @param {Login_ThrottledInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_throttled: ((inputs?: Login_ThrottledInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Login_ThrottledInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Login_ThrottledInputs = {};
