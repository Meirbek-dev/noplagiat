/**
* | output |
* | --- |
* | "For the selected period" |
*
* @param {Kpi_Total_Checks_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_total_checks_hint: ((inputs?: Kpi_Total_Checks_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Total_Checks_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Total_Checks_HintInputs = {};
