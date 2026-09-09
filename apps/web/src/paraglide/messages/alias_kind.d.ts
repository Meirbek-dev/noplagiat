/**
* | output |
* | --- |
* | "Dictionary kind" |
*
* @param {Alias_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_kind: ((inputs?: Alias_KindInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Alias_KindInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Alias_KindInputs = {};
