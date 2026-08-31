/**
* | output |
* | --- |
* | "Originality, %" |
*
* @param {Chart_Axis_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_originality: ((inputs?: Chart_Axis_OriginalityInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_OriginalityInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Axis_OriginalityInputs = {};
