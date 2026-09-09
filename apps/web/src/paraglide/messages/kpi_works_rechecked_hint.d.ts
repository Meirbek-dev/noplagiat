/**
* | output |
* | --- |
* | "Works with more than one attempt" |
*
* @param {Kpi_Works_Rechecked_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_rechecked_hint: ((inputs?: Kpi_Works_Rechecked_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Works_Rechecked_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Works_Rechecked_HintInputs = {};
