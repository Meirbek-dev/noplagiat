/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Initiator_Rules_TitleInputs */

const ru_initiator_rules_title = /** @type {(inputs: Initiator_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Правила определения инициатора`)
};

const kk_initiator_rules_title = /** @type {(inputs: Initiator_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бастамашыны анықтау ережелері`)
};

const en_initiator_rules_title = /** @type {(inputs: Initiator_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Initiator rules`)
};

/**
* | output |
* | --- |
* | "Initiator rules" |
*
* @param {Initiator_Rules_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_rules_title = /** @type {((inputs?: Initiator_Rules_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_Rules_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_initiator_rules_title(inputs)
	if (locale === "en") return en_initiator_rules_title(inputs)
	return ru_initiator_rules_title(inputs)
});