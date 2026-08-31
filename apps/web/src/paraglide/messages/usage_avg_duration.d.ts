/**
* | output |
* | --- |
* | "Average check duration" |
*
* @param {Usage_Avg_DurationInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_avg_duration: ((inputs?: Usage_Avg_DurationInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Usage_Avg_DurationInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Usage_Avg_DurationInputs = {};
