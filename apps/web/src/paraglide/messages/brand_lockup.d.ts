/**
* | output |
* | --- |
* | "Toraighyrov University" |
*
* @param {Brand_LockupInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const brand_lockup: ((inputs?: Brand_LockupInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Brand_LockupInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Brand_LockupInputs = {};
