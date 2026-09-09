/**
* | output |
* | --- |
* | "CSV files" |
*
* @param {Source_Kind_CsvInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind_csv: ((inputs?: Source_Kind_CsvInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Kind_CsvInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Source_Kind_CsvInputs = {};
