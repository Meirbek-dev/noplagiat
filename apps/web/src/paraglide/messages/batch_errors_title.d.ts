/**
* | output |
* | --- |
* | "Rejected rows of batch #{id}" |
*
* @param {Batch_Errors_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_title: ((inputs: Batch_Errors_TitleInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batch_Errors_TitleInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batch_Errors_TitleInputs = {
    id: NonNullable<unknown>;
};
