/**
* | output |
* | --- |
* | "Spring semester start" |
*
* @param {Setting_Spring_StartInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_spring_start: ((inputs?: Setting_Spring_StartInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Spring_StartInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Spring_StartInputs = {};
