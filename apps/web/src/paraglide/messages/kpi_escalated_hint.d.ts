/**
* | output |
* | --- |
* | "Suspicious works whose flag has not been cleared" |
*
* @param {Kpi_Escalated_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_hint: ((inputs?: Kpi_Escalated_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Escalated_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Escalated_HintInputs = {};
