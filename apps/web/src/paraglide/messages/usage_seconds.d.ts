/**
* | output |
* | --- |
* | "{value} s" |
*
* @param {Usage_SecondsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_seconds: ((inputs: Usage_SecondsInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Usage_SecondsInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Usage_SecondsInputs = {
    value: NonNullable<unknown>;
};
