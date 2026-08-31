/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Alias_NoneInputs */

const ru_alias_none = /** @type {(inputs: Alias_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сопоставления не заданы.`)
};

const kk_alias_none = /** @type {(inputs: Alias_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сәйкестіктер белгіленбеген.`)
};

const en_alias_none = /** @type {(inputs: Alias_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No aliases defined.`)
};

/**
* | output |
* | --- |
* | "No aliases defined." |
*
* @param {Alias_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_none = /** @type {((inputs?: Alias_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_alias_none(inputs)
	if (locale === "en") return en_alias_none(inputs)
	return ru_alias_none(inputs)
});