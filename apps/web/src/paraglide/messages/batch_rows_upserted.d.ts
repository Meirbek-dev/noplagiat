/**
* | output |
* | --- |
* | "Upserted" |
*
* @param {Batch_Rows_UpsertedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_upserted: ((inputs?: Batch_Rows_UpsertedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Rows_UpsertedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batch_Rows_UpsertedInputs = {};
