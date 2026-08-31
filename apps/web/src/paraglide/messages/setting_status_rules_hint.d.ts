/**
* | output |
* | --- |
* | "JSON: default, escalate_when and a list of status/when rules." |
*
* @param {Setting_Status_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_status_rules_hint: ((inputs?: Setting_Status_Rules_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Status_Rules_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Status_Rules_HintInputs = {};
