/**
* | output |
* | --- |
* | "Cron expression; empty means manual runs only." |
*
* @param {Source_Schedule_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_schedule_hint: ((inputs?: Source_Schedule_HintInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Source_Schedule_HintInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Source_Schedule_HintInputs = {};
