/**
* | output |
* | --- |
* | "The teaching-staff role covers the public contour. Unit-level detail needs a separate role." |
*
* @param {Request_Access_Staff_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_staff_note: ((inputs?: Request_Access_Staff_NoteInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Request_Access_Staff_NoteInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Request_Access_Staff_NoteInputs = {};
