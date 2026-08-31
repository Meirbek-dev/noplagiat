/**
* | output |
* | --- |
* | "Ties a reviewer to a faculty and department; the unit breakdown is built on it." |
*
* @param {Staff_Units_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_units_hint: ((inputs?: Staff_Units_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Units_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Staff_Units_HintInputs = {};
