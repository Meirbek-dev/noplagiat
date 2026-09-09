/**
* | output |
* | --- |
* | "No rejected rows." |
*
* @param {Batch_Errors_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_empty: ((inputs?: Batch_Errors_EmptyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Errors_EmptyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batch_Errors_EmptyInputs = {};
