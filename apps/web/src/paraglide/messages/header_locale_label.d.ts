/**
* | output |
* | --- |
* | "Interface language" |
*
* @param {Header_Locale_LabelInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const header_locale_label: ((inputs?: Header_Locale_LabelInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Header_Locale_LabelInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Header_Locale_LabelInputs = {};
