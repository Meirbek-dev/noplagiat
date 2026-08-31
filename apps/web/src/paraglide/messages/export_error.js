/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Export_ErrorInputs */

const ru_export_error = /** @type {(inputs: Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось сформировать файл.`)
};

const kk_export_error = /** @type {(inputs: Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Файлды дайындау мүмкін болмады.`)
};

const en_export_error = /** @type {(inputs: Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The file could not be generated.`)
};

/**
* | output |
* | --- |
* | "The file could not be generated." |
*
* @param {Export_ErrorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_error = /** @type {((inputs?: Export_ErrorInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_ErrorInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_export_error(inputs)
	if (locale === "en") return en_export_error(inputs)
	return ru_export_error(inputs)
});