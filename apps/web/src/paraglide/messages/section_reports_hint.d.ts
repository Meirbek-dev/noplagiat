/**
* | output |
* | --- |
* | "Annual and ad-hoc anonymized reports." |
*
* @param {Section_Reports_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_reports_hint: ((inputs?: Section_Reports_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Reports_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Reports_HintInputs = {};
