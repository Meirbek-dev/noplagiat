/**
* | output |
* | --- |
* | "Category" |
*
* @param {Chart_Axis_CategoryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_category: ((inputs?: Chart_Axis_CategoryInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Axis_CategoryInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Axis_CategoryInputs = {};
