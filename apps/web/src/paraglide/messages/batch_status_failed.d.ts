/**
* | output |
* | --- |
* | "Failed" |
*
* @param {Batch_Status_FailedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_failed: ((inputs?: Batch_Status_FailedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Status_FailedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batch_Status_FailedInputs = {};
