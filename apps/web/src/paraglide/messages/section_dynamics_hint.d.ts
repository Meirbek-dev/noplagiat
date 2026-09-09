/**
* | output |
* | --- |
* | "Number of checks and average originality by month." |
*
* @param {Section_Dynamics_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_dynamics_hint: ((inputs?: Section_Dynamics_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Dynamics_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Dynamics_HintInputs = {};
