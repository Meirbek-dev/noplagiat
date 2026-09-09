/**
* | output |
* | --- |
* | "Every run is journalled: time, source, row counts, validation errors." |
*
* @param {Batches_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_hint: ((inputs?: Batches_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Batches_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Batches_HintInputs = {};
