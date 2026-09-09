/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_NoneInputs */

const ru_rule_none = /** @type {(inputs: Rule_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Правила не заданы.`)
};

const kk_rule_none = /** @type {(inputs: Rule_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ережелер белгіленбеген.`)
};

const en_rule_none = /** @type {(inputs: Rule_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No rules defined.`)
};

/**
* | output |
* | --- |
* | "No rules defined." |
*
* @param {Rule_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_none = /** @type {((inputs?: Rule_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_none(inputs)
	if (locale === "en") return en_rule_none(inputs)
	return ru_rule_none(inputs)
});