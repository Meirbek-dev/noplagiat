/**
* | output |
* | --- |
* | "A breakdown by study programme is not available yet." |
*
* @param {Units_Program_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_program_footnote: ((inputs?: Units_Program_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Program_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Units_Program_FootnoteInputs = {};
