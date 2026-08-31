/**
* | output |
* | --- |
* | "Of all works" |
*
* @param {Kpi_Recheck_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_recheck_share_hint: ((inputs?: Kpi_Recheck_Share_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Recheck_Share_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Recheck_Share_HintInputs = {};
