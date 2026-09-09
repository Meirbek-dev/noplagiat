/**
* | output |
* | --- |
* | "up by {delta}" |
*
* @param {Chart_Kpi_Delta_UpInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_up: ((inputs: Chart_Kpi_Delta_UpInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Kpi_Delta_UpInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Kpi_Delta_UpInputs = {
    delta: NonNullable<unknown>;
};
