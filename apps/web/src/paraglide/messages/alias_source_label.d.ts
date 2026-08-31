/**
* | output |
* | --- |
* | "Label in the source" |
*
* @param {Alias_Source_LabelInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_source_label: ((inputs?: Alias_Source_LabelInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Alias_Source_LabelInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Alias_Source_LabelInputs = {};
