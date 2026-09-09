/**
* | output |
* | --- |
* | "Administration areas" |
*
* @param {Admin_Nav_AreasInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_nav_areas: ((inputs?: Admin_Nav_AreasInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Nav_AreasInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Nav_AreasInputs = {};
