/**
* | output |
* | --- |
* | "Skipped" |
*
* @param {Batch_Rows_SkippedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_skipped: ((inputs?: Batch_Rows_SkippedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Rows_SkippedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batch_Rows_SkippedInputs = {};
