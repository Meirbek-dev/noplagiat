/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Status_SucceededInputs */

const ru_batch_status_succeeded = /** @type {(inputs: Batch_Status_SucceededInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Успешно`)
};

const kk_batch_status_succeeded = /** @type {(inputs: Batch_Status_SucceededInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сәтті`)
};

const en_batch_status_succeeded = /** @type {(inputs: Batch_Status_SucceededInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Succeeded`)
};

/**
* | output |
* | --- |
* | "Succeeded" |
*
* @param {Batch_Status_SucceededInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_succeeded = /** @type {((inputs?: Batch_Status_SucceededInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Status_SucceededInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_status_succeeded(inputs)
	if (locale === "en") return en_batch_status_succeeded(inputs)
	return ru_batch_status_succeeded(inputs)
});