/**
* | output |
* | --- |
* | "Quick links" |
*
* @param {Admin_Quick_LinksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_quick_links: ((inputs?: Admin_Quick_LinksInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Admin_Quick_LinksInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Admin_Quick_LinksInputs = {};
