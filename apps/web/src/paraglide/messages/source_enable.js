/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_EnableInputs */

const ru_source_enable = /** @type {(inputs: Source_EnableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включить`)
};

const kk_source_enable = /** @type {(inputs: Source_EnableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қосу`)
};

const en_source_enable = /** @type {(inputs: Source_EnableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable`)
};

/**
* | output |
* | --- |
* | "Enable" |
*
* @param {Source_EnableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enable = /** @type {((inputs?: Source_EnableInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_EnableInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_enable(inputs)
	if (locale === "en") return en_source_enable(inputs)
	return ru_source_enable(inputs)
});