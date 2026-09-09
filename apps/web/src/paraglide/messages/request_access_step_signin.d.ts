/**
* | output |
* | --- |
* | "Sign in again once the role is granted, and the section opens." |
*
* @param {Request_Access_Step_SigninInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_signin: ((inputs?: Request_Access_Step_SigninInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_Step_SigninInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Request_Access_Step_SigninInputs = {};
