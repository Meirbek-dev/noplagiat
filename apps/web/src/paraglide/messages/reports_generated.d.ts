/**
* | output |
* | --- |
* | "Generated {date}" |
*
* @param {Reports_GeneratedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_generated: ((inputs: Reports_GeneratedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Reports_GeneratedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reports_GeneratedInputs = {
    date: NonNullable<unknown>;
};
