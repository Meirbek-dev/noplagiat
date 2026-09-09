/**
* | output |
* | --- |
* | "Rechecks" |
*
* @param {Chart_Series_RechecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_rechecks: ((inputs?: Chart_Series_RechecksInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Series_RechecksInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Series_RechecksInputs = {};
