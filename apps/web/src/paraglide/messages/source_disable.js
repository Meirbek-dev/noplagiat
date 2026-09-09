/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_DisableInputs */

const ru_source_disable = /** @type {(inputs: Source_DisableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отключить`)
};

const kk_source_disable = /** @type {(inputs: Source_DisableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өшіру`)
};

const en_source_disable = /** @type {(inputs: Source_DisableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disable`)
};

/**
* | output |
* | --- |
* | "Disable" |
*
* @param {Source_DisableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_disable = /** @type {((inputs?: Source_DisableInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_DisableInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_disable(inputs)
	if (locale === "en") return en_source_disable(inputs)
	return ru_source_disable(inputs)
});