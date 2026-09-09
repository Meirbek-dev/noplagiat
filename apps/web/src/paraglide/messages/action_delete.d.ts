/**
* | output |
* | --- |
* | "Delete" |
*
* @param {Action_DeleteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const action_delete: ((inputs?: Action_DeleteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Action_DeleteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Action_DeleteInputs = {};
