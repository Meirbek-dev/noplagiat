/**
* | output |
* | --- |
* | "Metrics within your area of visibility." |
*
* @param {Internal_Overview_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_overview_hint: ((inputs?: Internal_Overview_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Overview_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Internal_Overview_HintInputs = {};
