/**
* | output |
* | --- |
* | "Base URL for an API source, watched directory for a CSV one." |
*
* @param {Source_Base_Url_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_base_url_hint: ((inputs?: Source_Base_Url_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Base_Url_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Source_Base_Url_HintInputs = {};
