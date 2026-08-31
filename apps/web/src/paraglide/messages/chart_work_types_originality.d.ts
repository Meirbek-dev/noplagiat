/**
* | output |
* | --- |
* | "Originality by work type" |
*
* @param {Chart_Work_Types_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_work_types_originality: ((inputs?: Chart_Work_Types_OriginalityInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Work_Types_OriginalityInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Work_Types_OriginalityInputs = {};
