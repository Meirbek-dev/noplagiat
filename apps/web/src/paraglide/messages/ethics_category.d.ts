/**
* | output |
* | --- |
* | "Violation category" |
*
* @param {Ethics_CategoryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_category: ((inputs?: Ethics_CategoryInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_CategoryInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Ethics_CategoryInputs = {};
