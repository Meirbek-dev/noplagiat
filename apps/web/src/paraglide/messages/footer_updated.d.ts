/**
* | output |
* | --- |
* | "The data is refreshed at least once a day." |
*
* @param {Footer_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_updated: ((inputs?: Footer_UpdatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Footer_UpdatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Footer_UpdatedInputs = {};
