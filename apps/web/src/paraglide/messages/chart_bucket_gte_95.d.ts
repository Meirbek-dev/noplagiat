/**
* | output |
* | --- |
* | "95% and above" |
*
* @param {Chart_Bucket_Gte_95Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_gte_95: ((inputs?: Chart_Bucket_Gte_95Inputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Bucket_Gte_95Inputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Bucket_Gte_95Inputs = {};
