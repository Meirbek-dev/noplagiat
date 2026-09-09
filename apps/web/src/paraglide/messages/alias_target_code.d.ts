/**
* | output |
* | --- |
* | "Target code" |
*
* @param {Alias_Target_CodeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_target_code: ((inputs?: Alias_Target_CodeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Alias_Target_CodeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Alias_Target_CodeInputs = {};
