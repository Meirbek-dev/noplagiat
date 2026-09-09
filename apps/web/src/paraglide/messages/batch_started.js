/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_StartedInputs */

const ru_batch_started = /** @type {(inputs: Batch_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Начало`)
};

const kk_batch_started = /** @type {(inputs: Batch_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басталуы`)
};

const en_batch_started = /** @type {(inputs: Batch_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Started`)
};

/**
* | output |
* | --- |
* | "Started" |
*
* @param {Batch_StartedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_started = /** @type {((inputs?: Batch_StartedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_StartedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_started(inputs)
	if (locale === "en") return en_batch_started(inputs)
	return ru_batch_started(inputs)
});