/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Status_RulesInputs */

const ru_setting_status_rules = /** @type {(inputs: Setting_Status_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Правила определения статуса`)
};

const kk_setting_status_rules = /** @type {(inputs: Setting_Status_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мәртебені анықтау ережелері`)
};

const en_setting_status_rules = /** @type {(inputs: Setting_Status_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status derivation rules`)
};

/**
* | output |
* | --- |
* | "Status derivation rules" |
*
* @param {Setting_Status_RulesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_status_rules = /** @type {((inputs?: Setting_Status_RulesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Status_RulesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_status_rules(inputs)
	if (locale === "en") return en_setting_status_rules(inputs)
	return ru_setting_status_rules(inputs)
});