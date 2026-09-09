/**
* | output |
* | --- |
* | "Mean across every check in the period" |
*
* @param {Kpi_Avg_Originality_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_avg_originality_hint: ((inputs?: Kpi_Avg_Originality_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Avg_Originality_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Avg_Originality_HintInputs = {};
