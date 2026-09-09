/**
* | output |
* | --- |
* | "Spring semester {year}" |
*
* @param {Chart_Semester_SpringInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_spring: ((inputs: Chart_Semester_SpringInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Semester_SpringInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Semester_SpringInputs = {
    year: NonNullable<unknown>;
};
