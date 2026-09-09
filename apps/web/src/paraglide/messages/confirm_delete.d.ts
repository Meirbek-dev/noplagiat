/**
* | output |
* | --- |
* | "Delete this entry? This cannot be undone." |
*
* @param {Confirm_DeleteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_delete: ((inputs?: Confirm_DeleteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Confirm_DeleteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Confirm_DeleteInputs = {};
