/**
* | output |
* | --- |
* | "The API response cache was cleared - the change is visible immediately." |
*
* @param {Settings_Saved_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_saved_hint: ((inputs?: Settings_Saved_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Settings_Saved_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settings_Saved_HintInputs = {};
