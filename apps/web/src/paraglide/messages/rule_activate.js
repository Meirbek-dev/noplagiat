/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_ActivateInputs */

const ru_rule_activate = /** @type {(inputs: Rule_ActivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включить`)
};

const kk_rule_activate = /** @type {(inputs: Rule_ActivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қосу`)
};

const en_rule_activate = /** @type {(inputs: Rule_ActivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable`)
};

/**
* | output |
* | --- |
* | "Enable" |
*
* @param {Rule_ActivateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_activate = /** @type {((inputs?: Rule_ActivateInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_ActivateInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_activate(inputs)
	if (locale === "en") return en_rule_activate(inputs)
	return ru_rule_activate(inputs)
});