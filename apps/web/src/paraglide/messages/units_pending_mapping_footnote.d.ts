/**
* | output |
* | --- |
* | "The breakdown by unit becomes available once the mapping of reviewers to units has been loaded." |
*
* @param {Units_Pending_Mapping_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_pending_mapping_footnote: ((inputs?: Units_Pending_Mapping_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Pending_Mapping_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Units_Pending_Mapping_FootnoteInputs = {};
