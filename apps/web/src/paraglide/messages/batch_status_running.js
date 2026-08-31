/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Status_RunningInputs */

const ru_batch_status_running = /** @type {(inputs: Batch_Status_RunningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выполняется`)
};

const kk_batch_status_running = /** @type {(inputs: Batch_Status_RunningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Орындалуда`)
};

const en_batch_status_running = /** @type {(inputs: Batch_Status_RunningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Running`)
};

/**
* | output |
* | --- |
* | "Running" |
*
* @param {Batch_Status_RunningInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status_running = /** @type {((inputs?: Batch_Status_RunningInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Status_RunningInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_status_running(inputs)
	if (locale === "en") return en_batch_status_running(inputs)
	return ru_batch_status_running(inputs)
});