/**
* | output |
* | --- |
* | "Maps the source system's labels onto the dashboard dictionaries." |
*
* @param {Aliases_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const aliases_hint: ((inputs?: Aliases_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Aliases_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aliases_HintInputs = {};
