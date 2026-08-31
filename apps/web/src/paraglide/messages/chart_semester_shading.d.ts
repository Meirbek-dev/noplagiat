/**
* | output |
* | --- |
* | "Shading marks the autumn semester" |
*
* @param {Chart_Semester_ShadingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_shading: ((inputs?: Chart_Semester_ShadingInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Semester_ShadingInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Semester_ShadingInputs = {};
