/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_InitiatorInputs */

const ru_rule_initiator = /** @type {(inputs: Rule_InitiatorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Инициатор`)
};

const kk_rule_initiator = /** @type {(inputs: Rule_InitiatorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бастамашы`)
};

const en_rule_initiator = /** @type {(inputs: Rule_InitiatorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Initiator`)
};

/**
* | output |
* | --- |
* | "Initiator" |
*
* @param {Rule_InitiatorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_initiator = /** @type {((inputs?: Rule_InitiatorInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_InitiatorInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_initiator(inputs)
	if (locale === "en") return en_rule_initiator(inputs)
	return ru_rule_initiator(inputs)
});