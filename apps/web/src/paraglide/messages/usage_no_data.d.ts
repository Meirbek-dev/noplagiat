/**
* | output |
* | --- |
* | "no data" |
*
* @param {Usage_No_DataInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_no_data: ((inputs?: Usage_No_DataInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Usage_No_DataInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Usage_No_DataInputs = {};
