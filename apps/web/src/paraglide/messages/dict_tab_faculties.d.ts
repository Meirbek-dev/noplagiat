/**
* | output |
* | --- |
* | "Faculties" |
*
* @param {Dict_Tab_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_faculties: ((inputs?: Dict_Tab_FacultiesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Tab_FacultiesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_Tab_FacultiesInputs = {};
