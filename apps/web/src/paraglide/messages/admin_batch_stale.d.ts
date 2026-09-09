/**
* | output |
* | --- |
* | "No refresh for {hours} h" |
*
* @param {Admin_Batch_StaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_batch_stale: ((inputs: Admin_Batch_StaleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Batch_StaleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Batch_StaleInputs = {
    hours: NonNullable<unknown>;
};
