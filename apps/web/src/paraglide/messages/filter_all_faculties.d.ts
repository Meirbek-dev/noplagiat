/**
* | output |
* | --- |
* | "All faculties" |
*
* @param {Filter_All_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_faculties: ((inputs?: Filter_All_FacultiesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_All_FacultiesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_All_FacultiesInputs = {};
