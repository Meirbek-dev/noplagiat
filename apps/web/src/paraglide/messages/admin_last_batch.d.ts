/**
* | output |
* | --- |
* | "Last import" |
*
* @param {Admin_Last_BatchInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_last_batch: ((inputs?: Admin_Last_BatchInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Last_BatchInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Last_BatchInputs = {};
