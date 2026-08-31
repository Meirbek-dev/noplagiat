/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Rows_ReadInputs */

const ru_batch_rows_read = /** @type {(inputs: Batch_Rows_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Прочитано`)
};

const kk_batch_rows_read = /** @type {(inputs: Batch_Rows_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оқылды`)
};

const en_batch_rows_read = /** @type {(inputs: Batch_Rows_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read`)
};

/**
* | output |
* | --- |
* | "Read" |
*
* @param {Batch_Rows_ReadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_read = /** @type {((inputs?: Batch_Rows_ReadInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Rows_ReadInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_rows_read(inputs)
	if (locale === "en") return en_batch_rows_read(inputs)
	return ru_batch_rows_read(inputs)
});