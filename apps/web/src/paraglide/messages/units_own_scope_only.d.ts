/**
* | output |
* | --- |
* | "No breakdown: your scope is a single unit, and its figures are above." |
*
* @param {Units_Own_Scope_OnlyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_own_scope_only: ((inputs?: Units_Own_Scope_OnlyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Units_Own_Scope_OnlyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Units_Own_Scope_OnlyInputs = {};
