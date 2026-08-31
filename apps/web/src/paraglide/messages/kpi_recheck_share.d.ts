/**
* | output |
* | --- |
* | "Recheck share" |
*
* @param {Kpi_Recheck_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_recheck_share: ((inputs?: Kpi_Recheck_ShareInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Recheck_ShareInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Recheck_ShareInputs = {};
