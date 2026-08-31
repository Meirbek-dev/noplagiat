/**
* | output |
* | --- |
* | "Derive the initiator role from the reviewer's address." |
*
* @param {Initiator_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_rules_hint: ((inputs?: Initiator_Rules_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_Rules_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Initiator_Rules_HintInputs = {};
