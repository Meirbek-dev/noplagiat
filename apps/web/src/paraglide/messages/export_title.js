/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Export_TitleInputs */

const ru_export_title = /** @type {(inputs: Export_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выгрузка данных`)
};

const kk_export_title = /** @type {(inputs: Export_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректерді жүктеп алу`)
};

const en_export_title = /** @type {(inputs: Export_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Data export`)
};

/**
* | output |
* | --- |
* | "Data export" |
*
* @param {Export_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_title = /** @type {((inputs?: Export_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_export_title(inputs)
	if (locale === "en") return en_export_title(inputs)
	return ru_export_title(inputs)
});