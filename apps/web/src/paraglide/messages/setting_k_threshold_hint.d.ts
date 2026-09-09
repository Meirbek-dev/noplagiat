/**
* | output |
* | --- |
* | "Groups smaller than k are not published. The recommended value is 5." |
*
* @param {Setting_K_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_k_threshold_hint: ((inputs?: Setting_K_Threshold_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_K_Threshold_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_K_Threshold_HintInputs = {};
