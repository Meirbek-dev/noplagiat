/**
* | output |
* | --- |
* | "SSO group mappings" |
*
* @param {Setting_Role_MappingsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_role_mappings: ((inputs?: Setting_Role_MappingsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Role_MappingsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Role_MappingsInputs = {};
