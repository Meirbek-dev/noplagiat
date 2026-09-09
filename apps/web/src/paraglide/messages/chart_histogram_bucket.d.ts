/**
* | output |
* | --- |
* | "Originality range" |
*
* @param {Chart_Histogram_BucketInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_histogram_bucket: ((inputs?: Chart_Histogram_BucketInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Histogram_BucketInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Histogram_BucketInputs = {};
