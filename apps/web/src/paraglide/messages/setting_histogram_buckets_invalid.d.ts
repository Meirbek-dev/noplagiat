/**
* | output |
* | --- |
* | "Edges must ascend and stay between 0 and 100" |
*
* @param {Setting_Histogram_Buckets_InvalidInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets_invalid: ((inputs?: Setting_Histogram_Buckets_InvalidInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Histogram_Buckets_InvalidInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Histogram_Buckets_InvalidInputs = {};
