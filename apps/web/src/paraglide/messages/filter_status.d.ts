/**
* | output |
* | --- |
* | "Check status" |
*
* @param {Filter_StatusInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_status: ((inputs?: Filter_StatusInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_StatusInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_StatusInputs = {};
