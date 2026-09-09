/**
* | output |
* | --- |
* | "The run has started - watch the import journal." |
*
* @param {Source_Run_StartedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_run_started: ((inputs?: Source_Run_StartedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Run_StartedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Source_Run_StartedInputs = {};
