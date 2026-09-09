/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Chart_Series_EscalatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_escalated: ((inputs?: Chart_Series_EscalatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Series_EscalatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Series_EscalatedInputs = {};
