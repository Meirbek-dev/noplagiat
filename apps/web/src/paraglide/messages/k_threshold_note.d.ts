/**
* | output |
* | --- |
* | "Groups smaller than {k} checks are not published - the value is replaced by «insufficient data»." |
*
* @param {K_Threshold_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const k_threshold_note: ((inputs: K_Threshold_NoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<K_Threshold_NoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type K_Threshold_NoteInputs = {
    k: NonNullable<unknown>;
};
