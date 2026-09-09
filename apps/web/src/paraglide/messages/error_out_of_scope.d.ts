/**
* | output |
* | --- |
* | "The selected unit is outside your area of visibility. Change the filter or contact an administrator." |
*
* @param {Error_Out_Of_ScopeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_out_of_scope: ((inputs?: Error_Out_Of_ScopeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Error_Out_Of_ScopeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Error_Out_Of_ScopeInputs = {};
