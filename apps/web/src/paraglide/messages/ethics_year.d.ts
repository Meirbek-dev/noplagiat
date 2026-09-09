/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Ethics_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_year: ((inputs?: Ethics_YearInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_YearInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Ethics_YearInputs = {};
