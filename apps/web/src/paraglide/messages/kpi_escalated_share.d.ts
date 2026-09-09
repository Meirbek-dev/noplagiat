/**
* | output |
* | --- |
* | "Escalation share" |
*
* @param {Kpi_Escalated_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_share: ((inputs?: Kpi_Escalated_ShareInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Escalated_ShareInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Escalated_ShareInputs = {};
