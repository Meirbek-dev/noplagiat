/**
* | output |
* | --- |
* | "Rejected" |
*
* @param {Batch_Rows_RejectedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_rejected: ((inputs?: Batch_Rows_RejectedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Rows_RejectedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batch_Rows_RejectedInputs = {};
