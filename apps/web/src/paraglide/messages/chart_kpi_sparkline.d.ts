/**
* | output |
* | --- |
* | "Trend over the period" |
*
* @param {Chart_Kpi_SparklineInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_sparkline: ((inputs?: Chart_Kpi_SparklineInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Kpi_SparklineInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Kpi_SparklineInputs = {};
