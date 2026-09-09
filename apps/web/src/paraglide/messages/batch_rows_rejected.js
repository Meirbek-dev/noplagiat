/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Rows_RejectedInputs */

const ru_batch_rows_rejected = /** @type {(inputs: Batch_Rows_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отклонено`)
};

const kk_batch_rows_rejected = /** @type {(inputs: Batch_Rows_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қабылданбады`)
};

const en_batch_rows_rejected = /** @type {(inputs: Batch_Rows_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected`)
};

/**
* | output |
* | --- |
* | "Rejected" |
*
* @param {Batch_Rows_RejectedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_rows_rejected = /** @type {((inputs?: Batch_Rows_RejectedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Rows_RejectedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_rows_rejected(inputs)
	if (locale === "en") return en_batch_rows_rejected(inputs)
	return ru_batch_rows_rejected(inputs)
});