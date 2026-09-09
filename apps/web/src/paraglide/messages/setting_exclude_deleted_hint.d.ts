/**
* | output |
* | --- |
* | "Rows marked deleted stay out of the aggregates." |
*
* @param {Setting_Exclude_Deleted_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_exclude_deleted_hint: ((inputs?: Setting_Exclude_Deleted_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Exclude_Deleted_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Exclude_Deleted_HintInputs = {};
