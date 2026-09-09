/**
* | output |
* | --- |
* | "Recheck" |
*
* @param {Status_RecheckInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_recheck: ((inputs?: Status_RecheckInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Status_RecheckInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Status_RecheckInputs = {};
