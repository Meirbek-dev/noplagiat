/**
* | output |
* | --- |
* | "English" |
*
* @param {Locale_Name_EnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_en: ((inputs?: Locale_Name_EnInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Locale_Name_EnInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Locale_Name_EnInputs = {};
