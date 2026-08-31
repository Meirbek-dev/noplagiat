/**
* | output |
* | --- |
* | "Average originality" |
*
* @param {Kpi_Avg_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_avg_originality: ((inputs?: Kpi_Avg_OriginalityInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Avg_OriginalityInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Avg_OriginalityInputs = {};
