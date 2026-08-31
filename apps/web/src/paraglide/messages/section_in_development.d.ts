/**
* | output |
* | --- |
* | "{section} - in development" |
*
* @param {Section_In_DevelopmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_in_development: ((inputs: Section_In_DevelopmentInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Section_In_DevelopmentInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Section_In_DevelopmentInputs = {
    section: NonNullable<unknown>;
};
