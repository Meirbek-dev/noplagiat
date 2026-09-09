/**
* | output |
* | --- |
* | "down by {delta}" |
*
* @param {Chart_Kpi_Delta_DownInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_down: ((inputs: Chart_Kpi_Delta_DownInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Kpi_Delta_DownInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Kpi_Delta_DownInputs = {
    delta: NonNullable<unknown>;
};
