/**
* | output |
* | --- |
* | "Ingest sources and refresh schedules; manual import runs." |
*
* @param {Admin_Sources_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_sources_hint: ((inputs?: Admin_Sources_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Sources_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Sources_HintInputs = {};
