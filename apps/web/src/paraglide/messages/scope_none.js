/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Scope_NoneInputs */

const ru_scope_none = /** @type {(inputs: Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Область не задана`)
};

const kk_scope_none = /** @type {(inputs: Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аймақ белгіленбеген`)
};

const en_scope_none = /** @type {(inputs: Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No scope`)
};

/**
* | output |
* | --- |
* | "No scope" |
*
* @param {Scope_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_none = /** @type {((inputs?: Scope_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Scope_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_scope_none(inputs)
	if (locale === "en") return en_scope_none(inputs)
	return ru_scope_none(inputs)
});