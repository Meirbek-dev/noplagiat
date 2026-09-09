/**
* | output |
* | --- |
* | "the system" |
*
* @param {Settings_Updated_By_SystemInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_updated_by_system: ((inputs?: Settings_Updated_By_SystemInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Settings_Updated_By_SystemInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settings_Updated_By_SystemInputs = {};
