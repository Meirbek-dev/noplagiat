/**
* | output |
* | --- |
* | "Rechecks by unit" |
*
* @param {Rechecks_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rechecks_units_title: ((inputs?: Rechecks_Units_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Rechecks_Units_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Rechecks_Units_TitleInputs = {};
