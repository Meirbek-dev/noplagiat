/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Kpi_EscalatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated: ((inputs?: Kpi_EscalatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_EscalatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_EscalatedInputs = {};
