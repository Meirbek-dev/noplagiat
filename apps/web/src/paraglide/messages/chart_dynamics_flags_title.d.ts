/**
* | output |
* | --- |
* | "Escalations and rechecks by month" |
*
* @param {Chart_Dynamics_Flags_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_dynamics_flags_title: ((inputs?: Chart_Dynamics_Flags_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Dynamics_Flags_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Dynamics_Flags_TitleInputs = {};
