/**
* | output |
* | --- |
* | "Active reviewers" |
*
* @param {Chart_Series_Active_ReviewersInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_active_reviewers: ((inputs?: Chart_Series_Active_ReviewersInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Series_Active_ReviewersInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Series_Active_ReviewersInputs = {};
