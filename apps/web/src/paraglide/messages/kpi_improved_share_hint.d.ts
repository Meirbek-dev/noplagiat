/**
* | output |
* | --- |
* | "Works improved: {count}" |
*
* @param {Kpi_Improved_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved_share_hint: ((inputs: Kpi_Improved_Share_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Kpi_Improved_Share_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Kpi_Improved_Share_HintInputs = {
    count: NonNullable<unknown>;
};
