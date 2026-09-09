/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Insufficient_DataInputs */

const ru_insufficient_data = /** @type {(inputs: Insufficient_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`недостаточно данных`)
};

const kk_insufficient_data = /** @type {(inputs: Insufficient_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`деректер жеткіліксіз`)
};

const en_insufficient_data = /** @type {(inputs: Insufficient_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`insufficient data`)
};

/**
* | output |
* | --- |
* | "insufficient data" |
*
* @param {Insufficient_DataInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const insufficient_data = /** @type {((inputs?: Insufficient_DataInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Insufficient_DataInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_insufficient_data(inputs)
	if (locale === "en") return en_insufficient_data(inputs)
	return ru_insufficient_data(inputs)
});