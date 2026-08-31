/**
* | output |
* | --- |
* | "Public contour" |
*
* @param {Internal_Nav_PublicInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_public: ((inputs?: Internal_Nav_PublicInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Internal_Nav_PublicInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Internal_Nav_PublicInputs = {};
