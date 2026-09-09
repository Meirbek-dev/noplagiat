/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_PriorityInputs */

const ru_rule_priority = /** @type {(inputs: Rule_PriorityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Приоритет`)
};

const kk_rule_priority = /** @type {(inputs: Rule_PriorityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басымдық`)
};

const en_rule_priority = /** @type {(inputs: Rule_PriorityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Priority`)
};

/**
* | output |
* | --- |
* | "Priority" |
*
* @param {Rule_PriorityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_priority = /** @type {((inputs?: Rule_PriorityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_PriorityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_priority(inputs)
	if (locale === "en") return en_rule_priority(inputs)
	return ru_rule_priority(inputs)
});