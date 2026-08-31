/**
* | output |
* | --- |
* | "not set" |
*
* @param {Source_Cursor_AbsentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor_absent: ((inputs?: Source_Cursor_AbsentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Cursor_AbsentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Source_Cursor_AbsentInputs = {};
