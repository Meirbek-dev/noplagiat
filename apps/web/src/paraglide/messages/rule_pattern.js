/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_PatternInputs */

const ru_rule_pattern = /** @type {(inputs: Rule_PatternInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шаблон`)
};

const kk_rule_pattern = /** @type {(inputs: Rule_PatternInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Үлгі`)
};

const en_rule_pattern = /** @type {(inputs: Rule_PatternInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pattern`)
};

/**
* | output |
* | --- |
* | "Pattern" |
*
* @param {Rule_PatternInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_pattern = /** @type {((inputs?: Rule_PatternInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_PatternInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_pattern(inputs)
	if (locale === "en") return en_rule_pattern(inputs)
	return ru_rule_pattern(inputs)
});