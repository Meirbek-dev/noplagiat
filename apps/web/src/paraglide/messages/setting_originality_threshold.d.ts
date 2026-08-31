/**
* | output |
* | --- |
* | "Originality threshold, %" |
*
* @param {Setting_Originality_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_originality_threshold: ((inputs?: Setting_Originality_ThresholdInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Originality_ThresholdInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Originality_ThresholdInputs = {};
