/**
* | output |
* | --- |
* | "Thresholds, semester boundaries and derivation rules. A change reaches the API immediately." |
*
* @param {Admin_Settings_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_settings_hint: ((inputs?: Admin_Settings_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Settings_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Settings_HintInputs = {};
