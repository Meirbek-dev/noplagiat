/**
* | output |
* | --- |
* | "Show or hide the menu" |
*
* @param {Internal_Nav_ToggleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_toggle: ((inputs?: Internal_Nav_ToggleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Nav_ToggleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Internal_Nav_ToggleInputs = {};
