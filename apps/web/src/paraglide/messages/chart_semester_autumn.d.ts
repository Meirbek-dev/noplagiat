/**
* | output |
* | --- |
* | "Autumn semester {year}" |
*
* @param {Chart_Semester_AutumnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_autumn: ((inputs: Chart_Semester_AutumnInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Semester_AutumnInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Semester_AutumnInputs = {
    year: NonNullable<unknown>;
};
