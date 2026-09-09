/**
* | output |
* | --- |
* | "Ethics Council register" |
*
* @param {Ethics_Cases_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_cases_title: ((inputs?: Ethics_Cases_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_Cases_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Ethics_Cases_TitleInputs = {};
