/**
* | output |
* | --- |
* | "Rechecked" |
*
* @param {Kpi_Works_RecheckedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_rechecked: ((inputs?: Kpi_Works_RecheckedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Works_RecheckedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Works_RecheckedInputs = {};
