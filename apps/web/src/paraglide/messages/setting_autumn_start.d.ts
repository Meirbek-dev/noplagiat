/**
* | output |
* | --- |
* | "Autumn semester start" |
*
* @param {Setting_Autumn_StartInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_autumn_start: ((inputs?: Setting_Autumn_StartInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Autumn_StartInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Autumn_StartInputs = {};
