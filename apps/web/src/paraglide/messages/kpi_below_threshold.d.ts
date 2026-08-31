/**
* | output |
* | --- |
* | "Share below the threshold" |
*
* @param {Kpi_Below_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_below_threshold: ((inputs?: Kpi_Below_ThresholdInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Below_ThresholdInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Below_ThresholdInputs = {};
