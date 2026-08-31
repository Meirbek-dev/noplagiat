/**
* | output |
* | --- |
* | "The system administrator grants the role and its scope - a faculty or a department." |
*
* @param {Request_Access_Step_AdminInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_admin: ((inputs?: Request_Access_Step_AdminInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_Step_AdminInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Request_Access_Step_AdminInputs = {};
