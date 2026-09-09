/**
* | output |
* | --- |
* | "Improved share" |
*
* @param {Kpi_Improved_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved_share: ((inputs?: Kpi_Improved_ShareInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Improved_ShareInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Improved_ShareInputs = {};
