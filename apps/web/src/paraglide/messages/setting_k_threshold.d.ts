/**
* | output |
* | --- |
* | "k-anonymity threshold" |
*
* @param {Setting_K_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_k_threshold: ((inputs?: Setting_K_ThresholdInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_K_ThresholdInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_K_ThresholdInputs = {};
