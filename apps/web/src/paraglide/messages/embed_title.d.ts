/**
* | output |
* | --- |
* | "Academic integrity - widget" |
*
* @param {Embed_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const embed_title: ((inputs?: Embed_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Embed_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Embed_TitleInputs = {};
