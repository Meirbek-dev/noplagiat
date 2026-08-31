/**
* | output |
* | --- |
* | "{total} entries. Retention is at least {days} days; there is no deletion path." |
*
* @param {Audit_FooterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_footer: ((inputs: Audit_FooterInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Audit_FooterInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Audit_FooterInputs = {
    total: NonNullable<unknown>;
    days: NonNullable<unknown>;
};
