/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Rows_UpsertedInputs */

const ru_batch_rows_upserted = /** @type {(inputs: Batch_Rows_UpsertedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Записано`)
};

const kk_batch_rows_upserted = /** @type {(inputs: Batch_Rows_UpsertedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жазылды`)
};

const en_batch_rows_upserted = /** @type {(inputs: Batch_Rows_UpsertedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Upserted`)
};

/**
* | output |
* | --- |
* | "Upserted" |
*
* @param {Batch_Rows_UpsertedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_upserted = /** @type {((inputs?: Batch_Rows_UpsertedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Rows_UpsertedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_rows_upserted(inputs)
	if (locale === "en") return en_batch_rows_upserted(inputs)
	return ru_batch_rows_upserted(inputs)
});