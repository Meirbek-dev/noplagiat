/**
* | output |
* | --- |
* | "Read: {read} · upserted: {upserted} · rejected: {rejected}" |
*
* @param {Admin_Batch_RowsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_batch_rows: ((inputs: Admin_Batch_RowsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Batch_RowsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Batch_RowsInputs = {
    read: NonNullable<unknown>;
    upserted: NonNullable<unknown>;
    rejected: NonNullable<unknown>;
};
