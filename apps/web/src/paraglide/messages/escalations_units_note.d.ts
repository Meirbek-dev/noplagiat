/**
* | output |
* | --- |
* | "The per-unit breakdown is always k-screened, whatever the role." |
*
* @param {Escalations_Units_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const escalations_units_note: ((inputs?: Escalations_Units_NoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Escalations_Units_NoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Escalations_Units_NoteInputs = {};
