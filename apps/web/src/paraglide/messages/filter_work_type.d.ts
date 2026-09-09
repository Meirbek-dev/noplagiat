/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Filter_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_work_type: ((inputs?: Filter_Work_TypeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Work_TypeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_Work_TypeInputs = {};
