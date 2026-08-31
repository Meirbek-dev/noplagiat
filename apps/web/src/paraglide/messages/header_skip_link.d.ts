/**
* | output |
* | --- |
* | "Skip to content" |
*
* @param {Header_Skip_LinkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const header_skip_link: ((inputs?: Header_Skip_LinkInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Header_Skip_LinkInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Header_Skip_LinkInputs = {};
