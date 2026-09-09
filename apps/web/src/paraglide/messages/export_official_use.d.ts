/**
* | output |
* | --- |
* | "For official use only. The export is journalled." |
*
* @param {Export_Official_UseInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_official_use: ((inputs?: Export_Official_UseInputs, options?: {
    locale?: "ru" | "kk" | "en";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Export_Official_UseInputs, {
    locale?: "ru" | "kk" | "en";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Export_Official_UseInputs = {};
