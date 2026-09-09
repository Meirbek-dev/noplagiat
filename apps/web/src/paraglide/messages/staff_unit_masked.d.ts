/**
* | output |
* | --- |
* | "Masked address" |
*
* @param {Staff_Unit_MaskedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_masked: ((inputs?: Staff_Unit_MaskedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Unit_MaskedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Staff_Unit_MaskedInputs = {};
