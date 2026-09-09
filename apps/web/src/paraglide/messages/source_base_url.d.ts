/**
* | output |
* | --- |
* | "Source address" |
*
* @param {Source_Base_UrlInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_base_url: ((inputs?: Source_Base_UrlInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Base_UrlInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Source_Base_UrlInputs = {};
