/**
* | output |
* | --- |
* | "The session has ended. Sign in again." |
*
* @param {Error_Session_ExpiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_session_expired: ((inputs?: Error_Session_ExpiredInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Error_Session_ExpiredInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Error_Session_ExpiredInputs = {};
