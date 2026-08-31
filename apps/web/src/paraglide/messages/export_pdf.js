/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Export_PdfInputs */

const ru_export_pdf = /** @type {(inputs: Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспорт PDF`)
};

const kk_export_pdf = /** @type {(inputs: Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF экспорты`)
};

const en_export_pdf = /** @type {(inputs: Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export PDF`)
};

/**
* | output |
* | --- |
* | "Export PDF" |
*
* @param {Export_PdfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_pdf = /** @type {((inputs?: Export_PdfInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_PdfInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_export_pdf(inputs)
	if (locale === "en") return en_export_pdf(inputs)
	return ru_export_pdf(inputs)
});