/**
* | output |
* | --- |
* | "Escalations by unit" |
*
* @param {Escalations_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const escalations_units_title: ((inputs?: Escalations_Units_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Escalations_Units_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Escalations_Units_TitleInputs = {};
