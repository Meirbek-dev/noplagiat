/**
* | output |
* | --- |
* | "This dashboard publishes anonymized statistics on originality checks of written work at Toraighyrov University. Figures are aggregated - by university, facul..." |
*
* @param {Footer_About_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_about_body: ((inputs?: Footer_About_BodyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Footer_About_BodyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Footer_About_BodyInputs = {};
