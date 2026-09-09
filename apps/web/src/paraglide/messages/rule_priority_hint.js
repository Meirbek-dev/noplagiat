/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_Priority_HintInputs */

const ru_rule_priority_hint = /** @type {(inputs: Rule_Priority_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Меньшее значение применяется раньше.`)
};

const kk_rule_priority_hint = /** @type {(inputs: Rule_Priority_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кіші мән бұрын қолданылады.`)
};

const en_rule_priority_hint = /** @type {(inputs: Rule_Priority_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The lowest value wins.`)
};

/**
* | output |
* | --- |
* | "The lowest value wins." |
*
* @param {Rule_Priority_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_priority_hint = /** @type {((inputs?: Rule_Priority_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_Priority_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_priority_hint(inputs)
	if (locale === "en") return en_rule_priority_hint(inputs)
	return ru_rule_priority_hint(inputs)
});