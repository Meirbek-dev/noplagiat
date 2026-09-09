/**
* | output |
* | --- |
* | "Try reloading the page. If the error persists, contact the system administrator." |
*
* @param {App_Error_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_body: ((inputs?: App_Error_BodyInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<App_Error_BodyInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type App_Error_BodyInputs = {};
