/**
* | output |
* | --- |
* | "insufficient data" |
*
* @param {Insufficient_DataInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const insufficient_data: ((inputs?: Insufficient_DataInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Insufficient_DataInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Insufficient_DataInputs = {};
