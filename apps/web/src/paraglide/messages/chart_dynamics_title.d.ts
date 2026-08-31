/**
* | output |
* | --- |
* | "Checks and average originality by month" |
*
* @param {Chart_Dynamics_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_dynamics_title: ((inputs?: Chart_Dynamics_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Chart_Dynamics_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Chart_Dynamics_TitleInputs = {};
