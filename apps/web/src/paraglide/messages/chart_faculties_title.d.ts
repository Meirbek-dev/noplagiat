/**
* | output |
* | --- |
* | "Figures by faculty" |
*
* @param {Chart_Faculties_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_faculties_title: ((inputs?: Chart_Faculties_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Faculties_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Faculties_TitleInputs = {};
