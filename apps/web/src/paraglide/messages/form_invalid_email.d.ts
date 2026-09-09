/**
* | output |
* | --- |
* | "Enter a valid e-mail address" |
*
* @param {Form_Invalid_EmailInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_email: ((inputs?: Form_Invalid_EmailInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_Invalid_EmailInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Form_Invalid_EmailInputs = {};
