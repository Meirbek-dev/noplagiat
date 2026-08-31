/**
* | output |
* | --- |
* | "No breakdown by work type is available: the source export carries no work-type field, and fewer than one per cent of checks can be classified from the docume..." |
*
* @param {Work_Types_Single_BucketInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_types_single_bucket: ((inputs?: Work_Types_Single_BucketInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Work_Types_Single_BucketInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Work_Types_Single_BucketInputs = {};
