/**
* | output |
* | --- |
* | "vs previous period" |
*
* @param {Chart_Kpi_PreviousInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_previous: ((inputs?: Chart_Kpi_PreviousInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Kpi_PreviousInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Kpi_PreviousInputs = {};
