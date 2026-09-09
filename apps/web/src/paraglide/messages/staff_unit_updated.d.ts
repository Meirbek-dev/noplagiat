/**
* | output |
* | --- |
* | "Updated" |
*
* @param {Staff_Unit_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_updated: ((inputs?: Staff_Unit_UpdatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Staff_Unit_UpdatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Staff_Unit_UpdatedInputs = {};
