/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_ActiveInputs */

const ru_rule_active = /** @type {(inputs: Rule_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Активно`)
};

const kk_rule_active = /** @type {(inputs: Rule_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белсенді`)
};

const en_rule_active = /** @type {(inputs: Rule_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

/**
* | output |
* | --- |
* | "Active" |
*
* @param {Rule_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_active = /** @type {((inputs?: Rule_ActiveInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_ActiveInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_active(inputs)
	if (locale === "en") return en_rule_active(inputs)
	return ru_rule_active(inputs)
});