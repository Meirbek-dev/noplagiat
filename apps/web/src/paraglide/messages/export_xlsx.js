/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Export_XlsxInputs */

const ru_export_xlsx = /** @type {(inputs: Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспорт Excel`)
};

const kk_export_xlsx = /** @type {(inputs: Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Excel экспорты`)
};

const en_export_xlsx = /** @type {(inputs: Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export Excel`)
};

/**
* | output |
* | --- |
* | "Export Excel" |
*
* @param {Export_XlsxInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_xlsx = /** @type {((inputs?: Export_XlsxInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_XlsxInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_export_xlsx(inputs)
	if (locale === "en") return en_export_xlsx(inputs)
	return ru_export_xlsx(inputs)
});