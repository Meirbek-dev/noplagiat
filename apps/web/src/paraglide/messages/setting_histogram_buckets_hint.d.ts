/**
* | output |
* | --- |
* | "Percentages, comma separated and ascending, e.g. 50, 70, 85, 95." |
*
* @param {Setting_Histogram_Buckets_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets_hint: ((inputs?: Setting_Histogram_Buckets_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Histogram_Buckets_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Histogram_Buckets_HintInputs = {};
