/**
* | output |
* | --- |
* | "Other" |
*
* @param {Internal_Nav_OtherInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_other: ((inputs?: Internal_Nav_OtherInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Nav_OtherInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Internal_Nav_OtherInputs = {};
