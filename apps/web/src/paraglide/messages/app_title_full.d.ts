/**
* | output |
* | --- |
* | "Antiplagiarism Dashboard - Toraighyrov University" |
*
* @param {App_Title_FullInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_title_full: ((inputs?: App_Title_FullInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<App_Title_FullInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type App_Title_FullInputs = {};
