/**
* | output |
* | --- |
* | "Closed" |
*
* @param {Ethics_ClosedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_closed: ((inputs?: Ethics_ClosedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Ethics_ClosedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Ethics_ClosedInputs = {};
