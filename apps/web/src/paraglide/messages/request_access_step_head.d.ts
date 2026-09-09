/**
* | output |
* | --- |
* | "The head of your unit submits an access request." |
*
* @param {Request_Access_Step_HeadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_head: ((inputs?: Request_Access_Step_HeadInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_Step_HeadInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Request_Access_Step_HeadInputs = {};
