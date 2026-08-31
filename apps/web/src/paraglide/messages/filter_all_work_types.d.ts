/**
* | output |
* | --- |
* | "All work types" |
*
* @param {Filter_All_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_work_types: ((inputs?: Filter_All_Work_TypesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_All_Work_TypesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_All_Work_TypesInputs = {};
