/**
* | output |
* | --- |
* | "Academic Integrity - Open Statistics" |
*
* @param {Public_Contour_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const public_contour_title: ((inputs?: Public_Contour_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Public_Contour_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Public_Contour_TitleInputs = {};
