/**
* | output |
* | --- |
* | "Distinct works in the period" |
*
* @param {Kpi_Works_Total_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_total_hint: ((inputs?: Kpi_Works_Total_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Works_Total_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Works_Total_HintInputs = {};
