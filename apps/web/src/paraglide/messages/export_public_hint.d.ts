/**
* | output |
* | --- |
* | "The file contains the figures for the selected period with the current filters applied." |
*
* @param {Export_Public_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_public_hint: ((inputs?: Export_Public_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_Public_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Export_Public_HintInputs = {};
