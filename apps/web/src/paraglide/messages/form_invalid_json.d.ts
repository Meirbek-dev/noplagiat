/**
* | output |
* | --- |
* | "Malformed JSON, or the structure does not match" |
*
* @param {Form_Invalid_JsonInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_json: ((inputs?: Form_Invalid_JsonInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Form_Invalid_JsonInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Form_Invalid_JsonInputs = {};
