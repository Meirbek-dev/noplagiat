/**
* | output |
* | --- |
* | "Checks by work type" |
*
* @param {Chart_Work_Types_CountsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_work_types_counts: ((inputs?: Chart_Work_Types_CountsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Work_Types_CountsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Work_Types_CountsInputs = {};
