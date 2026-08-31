/**
* | output |
* | --- |
* | "Works below the threshold count as needing attention. The default is 70." |
*
* @param {Setting_Originality_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_originality_threshold_hint: ((inputs?: Setting_Originality_Threshold_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Originality_Threshold_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Originality_Threshold_HintInputs = {};
