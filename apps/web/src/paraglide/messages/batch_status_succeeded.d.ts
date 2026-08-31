/**
* | output |
* | --- |
* | "Succeeded" |
*
* @param {Batch_Status_SucceededInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_succeeded: ((inputs?: Batch_Status_SucceededInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Status_SucceededInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batch_Status_SucceededInputs = {};
