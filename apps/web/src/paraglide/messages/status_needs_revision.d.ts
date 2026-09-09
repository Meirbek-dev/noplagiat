/**
* | output |
* | --- |
* | "Needs revision" |
*
* @param {Status_Needs_RevisionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_needs_revision: ((inputs?: Status_Needs_RevisionInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Status_Needs_RevisionInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Status_Needs_RevisionInputs = {};
