/**
* | output |
* | --- |
* | "Sections" |
*
* @param {Internal_Nav_SectionsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_sections: ((inputs?: Internal_Nav_SectionsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Nav_SectionsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Internal_Nav_SectionsInputs = {};
