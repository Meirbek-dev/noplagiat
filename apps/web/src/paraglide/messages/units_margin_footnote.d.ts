/**
* | output |
* | --- |
* | "A faculty total includes departments whose own cells are suppressed, so the visible rows need not add up to it." |
*
* @param {Units_Margin_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_margin_footnote: ((inputs?: Units_Margin_FootnoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Margin_FootnoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Units_Margin_FootnoteInputs = {};
