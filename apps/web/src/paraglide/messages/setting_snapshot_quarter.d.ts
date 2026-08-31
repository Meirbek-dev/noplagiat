/**
* | output |
* | --- |
* | "Public snapshot quarter" |
*
* @param {Setting_Snapshot_QuarterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_snapshot_quarter: ((inputs?: Setting_Snapshot_QuarterInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Setting_Snapshot_QuarterInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Setting_Snapshot_QuarterInputs = {};
