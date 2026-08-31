/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Status_FailedInputs */

const ru_batch_status_failed = /** @type {(inputs: Batch_Status_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ошибка`)
};

const kk_batch_status_failed = /** @type {(inputs: Batch_Status_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қате`)
};

const en_batch_status_failed = /** @type {(inputs: Batch_Status_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Failed`)
};

/**
* | output |
* | --- |
* | "Failed" |
*
* @param {Batch_Status_FailedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_failed = /** @type {((inputs?: Batch_Status_FailedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Status_FailedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_status_failed(inputs)
	if (locale === "en") return en_batch_status_failed(inputs)
	return ru_batch_status_failed(inputs)
});