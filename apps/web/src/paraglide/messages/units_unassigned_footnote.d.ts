/**
* | output |
* | --- |
* | "«Unassigned» covers checks whose reviewing unit could not be resolved." |
*
* @param {Units_Unassigned_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_unassigned_footnote: ((inputs?: Units_Unassigned_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Unassigned_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Units_Unassigned_FootnoteInputs = {};
