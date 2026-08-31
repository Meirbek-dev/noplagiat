/**
* | output |
* | --- |
* | "Go to the dashboard" |
*
* @param {App_Error_HomeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_home: ((inputs?: App_Error_HomeInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<App_Error_HomeInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type App_Error_HomeInputs = {};
