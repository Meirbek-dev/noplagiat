/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Kind_CsvInputs */

const ru_source_kind_csv = /** @type {(inputs: Source_Kind_CsvInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Файлы CSV`)
};

const kk_source_kind_csv = /** @type {(inputs: Source_Kind_CsvInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CSV файлдары`)
};

const en_source_kind_csv = /** @type {(inputs: Source_Kind_CsvInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CSV files`)
};

/**
* | output |
* | --- |
* | "CSV files" |
*
* @param {Source_Kind_CsvInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind_csv = /** @type {((inputs?: Source_Kind_CsvInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Kind_CsvInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_kind_csv(inputs)
	if (locale === "en") return en_source_kind_csv(inputs)
	return ru_source_kind_csv(inputs)
});