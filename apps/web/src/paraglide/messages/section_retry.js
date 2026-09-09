/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_RetryInputs */

const ru_section_retry = /** @type {(inputs: Section_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Повторить`)
};

const kk_section_retry = /** @type {(inputs: Section_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайталау`)
};

const en_section_retry = /** @type {(inputs: Section_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retry`)
};

/**
* | output |
* | --- |
* | "Retry" |
*
* @param {Section_RetryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_retry = /** @type {((inputs?: Section_RetryInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_RetryInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_retry(inputs)
	if (locale === "en") return en_section_retry(inputs)
	return ru_section_retry(inputs)
});