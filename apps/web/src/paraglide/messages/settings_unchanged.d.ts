/**
* | output |
* | --- |
* | "Nothing changed" |
*
* @param {Settings_UnchangedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_unchanged: ((inputs?: Settings_UnchangedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Settings_UnchangedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settings_UnchangedInputs = {};
