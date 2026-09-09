/**
* | output |
* | --- |
* | "Your role does not grant access to this section. Contact the system administrator." |
*
* @param {Error_Role_DeniedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_role_denied: ((inputs?: Error_Role_DeniedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Error_Role_DeniedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Error_Role_DeniedInputs = {};
