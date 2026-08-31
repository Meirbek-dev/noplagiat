/**
* | output |
* | --- |
* | "Checks below the threshold: {count}" |
*
* @param {Kpi_Below_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_below_threshold_hint: ((inputs: Kpi_Below_Threshold_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Below_Threshold_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Below_Threshold_HintInputs = {
    count: NonNullable<unknown>;
};
