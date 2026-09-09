/**
* | output |
* | --- |
* | "{count} of {total} values are hidden: insufficient data" |
*
* @param {Chart_Suppressed_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_suppressed_note: ((inputs: Chart_Suppressed_NoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Suppressed_NoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Suppressed_NoteInputs = {
    count: NonNullable<unknown>;
    total: NonNullable<unknown>;
};
