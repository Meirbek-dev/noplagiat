/**
* | output |
* | --- |
* | "Entered by hand by the compliance office; the source export does not carry it." |
*
* @param {Usage_Avg_Duration_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_avg_duration_hint: ((inputs?: Usage_Avg_Duration_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Usage_Avg_Duration_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Usage_Avg_Duration_HintInputs = {};
