/**
* | output |
* | --- |
* | "Loading data" |
*
* @param {Section_LoadingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_loading: ((inputs?: Section_LoadingInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_LoadingInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_LoadingInputs = {};
