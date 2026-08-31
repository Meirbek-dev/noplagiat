/**
* | output |
* | --- |
* | "All statuses" |
*
* @param {Filter_All_StatusesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_statuses: ((inputs?: Filter_All_StatusesInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_All_StatusesInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_All_StatusesInputs = {};
