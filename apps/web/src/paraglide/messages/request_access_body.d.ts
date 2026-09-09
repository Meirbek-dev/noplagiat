/**
* | output |
* | --- |
* | "You are signed in, but your account has no rights to the internal contour. Access is granted on a request from the head of your unit, agreed with the system ..." |
*
* @param {Request_Access_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_body: ((inputs?: Request_Access_BodyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_BodyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Request_Access_BodyInputs = {};
