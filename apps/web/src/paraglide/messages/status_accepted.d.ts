/**
* | output |
* | --- |
* | "Accepted" |
*
* @param {Status_AcceptedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_accepted: ((inputs?: Status_AcceptedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Status_AcceptedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Status_AcceptedInputs = {};
