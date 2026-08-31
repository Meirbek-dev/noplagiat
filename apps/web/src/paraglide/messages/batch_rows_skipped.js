/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Rows_SkippedInputs */

const ru_batch_rows_skipped = /** @type {(inputs: Batch_Rows_SkippedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пропущено`)
};

const kk_batch_rows_skipped = /** @type {(inputs: Batch_Rows_SkippedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өткізілді`)
};

const en_batch_rows_skipped = /** @type {(inputs: Batch_Rows_SkippedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skipped`)
};

/**
* | output |
* | --- |
* | "Skipped" |
*
* @param {Batch_Rows_SkippedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_skipped = /** @type {((inputs?: Batch_Rows_SkippedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Rows_SkippedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_rows_skipped(inputs)
	if (locale === "en") return en_batch_rows_skipped(inputs)
	return ru_batch_rows_skipped(inputs)
});