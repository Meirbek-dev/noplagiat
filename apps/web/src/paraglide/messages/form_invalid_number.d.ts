/**
* | output |
* | --- |
* | "Enter a non-negative whole number" |
*
* @param {Form_Invalid_NumberInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_number: ((inputs?: Form_Invalid_NumberInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_Invalid_NumberInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Form_Invalid_NumberInputs = {};
