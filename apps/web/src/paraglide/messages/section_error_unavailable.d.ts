/**
* | output |
* | --- |
* | "The service is temporarily unavailable." |
*
* @param {Section_Error_UnavailableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_error_unavailable: ((inputs?: Section_Error_UnavailableInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Error_UnavailableInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Error_UnavailableInputs = {};
