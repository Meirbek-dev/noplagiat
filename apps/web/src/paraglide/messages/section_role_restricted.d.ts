/**
* | output |
* | --- |
* | "This section is available to the ethics council and the compliance service. If you need it for your work, contact the system administrator." |
*
* @param {Section_Role_RestrictedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_role_restricted: ((inputs?: Section_Role_RestrictedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_Role_RestrictedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_Role_RestrictedInputs = {};
