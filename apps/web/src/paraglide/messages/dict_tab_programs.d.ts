/**
* | output |
* | --- |
* | "Programmes" |
*
* @param {Dict_Tab_ProgramsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_programs: ((inputs?: Dict_Tab_ProgramsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Tab_ProgramsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_Tab_ProgramsInputs = {};
