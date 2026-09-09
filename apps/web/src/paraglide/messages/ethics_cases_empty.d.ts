/**
* | output |
* | --- |
* | "The Ethics Council register is empty for this period." |
*
* @param {Ethics_Cases_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_cases_empty: ((inputs?: Ethics_Cases_EmptyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_Cases_EmptyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Ethics_Cases_EmptyInputs = {};
