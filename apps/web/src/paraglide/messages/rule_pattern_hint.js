/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_Pattern_HintInputs */

const ru_rule_pattern_hint = /** @type {(inputs: Rule_Pattern_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Подстрока, которая ищется в нормализованном названии работы.`)
};

const kk_rule_pattern_hint = /** @type {(inputs: Rule_Pattern_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыстың нормаланған атауынан ізделетін ішкі жол.`)
};

const en_rule_pattern_hint = /** @type {(inputs: Rule_Pattern_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Substring matched against the normalized work title.`)
};

/**
* | output |
* | --- |
* | "Substring matched against the normalized work title." |
*
* @param {Rule_Pattern_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_pattern_hint = /** @type {((inputs?: Rule_Pattern_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_Pattern_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_pattern_hint(inputs)
	if (locale === "en") return en_rule_pattern_hint(inputs)
	return ru_rule_pattern_hint(inputs)
});