/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_StatusInputs */

const ru_batch_status = /** @type {(inputs: Batch_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Статус`)
};

const kk_batch_status = /** @type {(inputs: Batch_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Күйі`)
};

const en_batch_status = /** @type {(inputs: Batch_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status`)
};

/**
* | output |
* | --- |
* | "Status" |
*
* @param {Batch_StatusInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_status = /** @type {((inputs?: Batch_StatusInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_StatusInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_status(inputs)
	if (locale === "en") return en_batch_status(inputs)
	return ru_batch_status(inputs)
});