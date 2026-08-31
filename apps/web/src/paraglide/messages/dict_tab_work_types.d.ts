/**
* | output |
* | --- |
* | "Work types" |
*
* @param {Dict_Tab_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_work_types: ((inputs?: Dict_Tab_Work_TypesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Tab_Work_TypesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_Tab_Work_TypesInputs = {};
