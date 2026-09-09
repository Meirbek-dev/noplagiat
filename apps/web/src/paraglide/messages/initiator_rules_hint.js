/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Initiator_Rules_HintInputs */

const ru_initiator_rules_hint = /** @type {(inputs: Initiator_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Определяют роль инициатора проверки по адресу проверяющего.`)
};

const kk_initiator_rules_hint = /** @type {(inputs: Initiator_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушінің мекенжайы бойынша тексеруді бастамашының рөлін анықтайды.`)
};

const en_initiator_rules_hint = /** @type {(inputs: Initiator_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Derive the initiator role from the reviewer's address.`)
};

/**
* | output |
* | --- |
* | "Derive the initiator role from the reviewer's address." |
*
* @param {Initiator_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_rules_hint = /** @type {((inputs?: Initiator_Rules_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_Rules_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_initiator_rules_hint(inputs)
	if (locale === "en") return en_initiator_rules_hint(inputs)
	return ru_initiator_rules_hint(inputs)
});