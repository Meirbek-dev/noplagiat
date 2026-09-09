/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Rule_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_work_type: ((inputs?: Rule_Work_TypeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rule_Work_TypeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Rule_Work_TypeInputs = {};
