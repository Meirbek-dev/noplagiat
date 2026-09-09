/**
* | output |
* | --- |
* | "Read" |
*
* @param {Batch_Rows_ReadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_read: ((inputs?: Batch_Rows_ReadInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Rows_ReadInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batch_Rows_ReadInputs = {};
