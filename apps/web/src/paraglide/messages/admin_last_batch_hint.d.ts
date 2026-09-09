/**
* | output |
* | --- |
* | "The internal contour refreshes at least once a day." |
*
* @param {Admin_Last_Batch_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_last_batch_hint: ((inputs?: Admin_Last_Batch_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Last_Batch_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Last_Batch_HintInputs = {};
