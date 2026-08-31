/**
* | output |
* | --- |
* | "Originality band edges" |
*
* @param {Setting_Histogram_BucketsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets: ((inputs?: Setting_Histogram_BucketsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Histogram_BucketsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Histogram_BucketsInputs = {};
