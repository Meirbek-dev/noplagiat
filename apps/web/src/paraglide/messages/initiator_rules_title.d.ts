/**
* | output |
* | --- |
* | "Initiator rules" |
*
* @param {Initiator_Rules_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_rules_title: ((inputs?: Initiator_Rules_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_Rules_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Initiator_Rules_TitleInputs = {};
