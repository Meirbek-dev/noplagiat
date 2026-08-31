/**
* | output |
* | --- |
* | "An array of objects: group, role and, where needed, faculty_code or department_code." |
*
* @param {Setting_Role_Mappings_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_role_mappings_hint: ((inputs?: Setting_Role_Mappings_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Role_Mappings_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Role_Mappings_HintInputs = {};
