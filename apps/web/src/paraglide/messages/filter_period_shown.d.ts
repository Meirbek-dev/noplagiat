/**
* | output |
* | --- |
* | "Showing {from} - {to}" |
*
* @param {Filter_Period_ShownInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_shown: ((inputs: Filter_Period_ShownInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Filter_Period_ShownInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Filter_Period_ShownInputs = {
    from: NonNullable<unknown>;
    to: NonNullable<unknown>;
};
