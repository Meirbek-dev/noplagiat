/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_Regex_HintInputs */

const ru_rule_regex_hint = /** @type {(inputs: Rule_Regex_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Регулярное выражение по нормализованному адресу проверяющего.`)
};

const kk_rule_regex_hint = /** @type {(inputs: Rule_Regex_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушінің нормаланған мекенжайы бойынша тұрақты өрнек.`)
};

const en_rule_regex_hint = /** @type {(inputs: Rule_Regex_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regular expression over the normalized reviewer address.`)
};

/**
* | output |
* | --- |
* | "Regular expression over the normalized reviewer address." |
*
* @param {Rule_Regex_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_regex_hint = /** @type {((inputs?: Rule_Regex_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_Regex_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_regex_hint(inputs)
	if (locale === "en") return en_rule_regex_hint(inputs)
	return ru_rule_regex_hint(inputs)
});