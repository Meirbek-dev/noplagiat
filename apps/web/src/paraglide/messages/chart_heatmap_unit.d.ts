/**
* | output |
* | --- |
* | "Unit" |
*
* @param {Chart_Heatmap_UnitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_heatmap_unit: ((inputs?: Chart_Heatmap_UnitInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Heatmap_UnitInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Heatmap_UnitInputs = {};
