/**
* | output |
* | --- |
* | "Sort order" |
*
* @param {Dict_Sort_OrderInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_sort_order: ((inputs?: Dict_Sort_OrderInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Dict_Sort_OrderInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Dict_Sort_OrderInputs = {};
