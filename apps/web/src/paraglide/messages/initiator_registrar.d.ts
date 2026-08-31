/**
* | output |
* | --- |
* | "Registrar's office" |
*
* @param {Initiator_RegistrarInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_registrar: ((inputs?: Initiator_RegistrarInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_RegistrarInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Initiator_RegistrarInputs = {};
