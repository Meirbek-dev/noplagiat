/**
* | output |
* | --- |
* | "Share of submitted works that were checked" |
*
* @param {Kpi_Coverage_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_coverage_hint: ((inputs?: Kpi_Coverage_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Coverage_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Coverage_HintInputs = {};
