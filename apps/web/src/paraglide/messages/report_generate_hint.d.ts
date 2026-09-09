/**
* | output |
* | --- |
* | "The annual report runs 1 September – 31 August; a manual report takes any date range." |
*
* @param {Report_Generate_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generate_hint: ((inputs?: Report_Generate_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Report_Generate_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Report_Generate_HintInputs = {};
