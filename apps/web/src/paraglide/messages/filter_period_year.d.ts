/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Filter_Period_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_year: ((inputs?: Filter_Period_YearInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Period_YearInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_Period_YearInputs = {};
