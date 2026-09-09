/**
* | output |
* | --- |
* | "Year over year" |
*
* @param {Section_YoyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_yoy: ((inputs?: Section_YoyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_YoyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_YoyInputs = {};
