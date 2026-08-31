/**
* | output |
* | --- |
* | "REST API" |
*
* @param {Source_Kind_ApiInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind_api: ((inputs?: Source_Kind_ApiInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Kind_ApiInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Source_Kind_ApiInputs = {};
