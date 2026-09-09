/**
* | output |
* | --- |
* | "set" |
*
* @param {Source_Cursor_PresentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor_present: ((inputs?: Source_Cursor_PresentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Cursor_PresentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Source_Cursor_PresentInputs = {};
