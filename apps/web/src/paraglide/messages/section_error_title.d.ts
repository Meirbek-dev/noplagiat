/**
* | output |
* | --- |
* | "This section could not be loaded" |
*
* @param {Section_Error_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_error_title: ((inputs?: Section_Error_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Error_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Error_TitleInputs = {};
