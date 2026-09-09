/**
* | output |
* | --- |
* | "Exclude deleted documents" |
*
* @param {Setting_Exclude_DeletedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_exclude_deleted: ((inputs?: Setting_Exclude_DeletedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Exclude_DeletedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Exclude_DeletedInputs = {};
