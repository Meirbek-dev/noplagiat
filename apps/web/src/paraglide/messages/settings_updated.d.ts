/**
* | output |
* | --- |
* | "Last changed {date} by {who}" |
*
* @param {Settings_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_updated: ((inputs: Settings_UpdatedInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Settings_UpdatedInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settings_UpdatedInputs = {
    date: NonNullable<unknown>;
    who: NonNullable<unknown>;
};
