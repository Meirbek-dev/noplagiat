/**
* | output |
* | --- |
* | "Metrics by faculty and department" |
*
* @param {Chart_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_units_title: ((inputs?: Chart_Units_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Units_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Units_TitleInputs = {};
