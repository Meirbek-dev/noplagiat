/**
* | output |
* | --- |
* | "The breakdown by unit is available from the 2025/26 academic year." |
*
* @param {Units_Coverage_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_coverage_footnote: ((inputs?: Units_Coverage_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Coverage_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Units_Coverage_FootnoteInputs = {};
