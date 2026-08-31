/**
* | output |
* | --- |
* | "Errors" |
*
* @param {Batch_Errors_ShowInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_show: ((inputs?: Batch_Errors_ShowInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Errors_ShowInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batch_Errors_ShowInputs = {};
