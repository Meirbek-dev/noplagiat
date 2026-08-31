/**
* | output |
* | --- |
* | "Semester boundaries" |
*
* @param {Chart_Semester_BandsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_bands: ((inputs?: Chart_Semester_BandsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Semester_BandsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Semester_BandsInputs = {};
