/**
* | output |
* | --- |
* | "Of the period's checks" |
*
* @param {Kpi_Escalated_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_share_hint: ((inputs?: Kpi_Escalated_Share_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Escalated_Share_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Escalated_Share_HintInputs = {};
