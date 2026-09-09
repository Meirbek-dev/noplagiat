/**
* | output |
* | --- |
* | "Colour scale: from the lowest to the highest value in the column" |
*
* @param {Chart_Heatmap_ScaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_heatmap_scale: ((inputs?: Chart_Heatmap_ScaleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Heatmap_ScaleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Heatmap_ScaleInputs = {};
