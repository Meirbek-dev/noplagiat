/**
* | output |
* | --- |
* | "Teaching staff (self-check)" |
*
* @param {Initiator_Staff_SelfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_staff_self: ((inputs?: Initiator_Staff_SelfInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Initiator_Staff_SelfInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Initiator_Staff_SelfInputs = {};
