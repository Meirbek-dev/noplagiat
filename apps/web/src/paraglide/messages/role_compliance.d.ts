/**
* | output |
* | --- |
* | "Compliance office" |
*
* @param {Role_ComplianceInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_compliance: ((inputs?: Role_ComplianceInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Role_ComplianceInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Role_ComplianceInputs = {};
