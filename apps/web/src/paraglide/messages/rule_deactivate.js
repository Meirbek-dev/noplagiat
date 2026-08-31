/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_DeactivateInputs */

const ru_rule_deactivate = /** @type {(inputs: Rule_DeactivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отключить`)
};

const kk_rule_deactivate = /** @type {(inputs: Rule_DeactivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өшіру`)
};

const en_rule_deactivate = /** @type {(inputs: Rule_DeactivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disable`)
};

/**
* | output |
* | --- |
* | "Disable" |
*
* @param {Rule_DeactivateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_deactivate = /** @type {((inputs?: Rule_DeactivateInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_DeactivateInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_deactivate(inputs)
	if (locale === "en") return en_rule_deactivate(inputs)
	return ru_rule_deactivate(inputs)
});