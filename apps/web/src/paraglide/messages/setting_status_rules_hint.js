/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Status_Rules_HintInputs */

const ru_setting_status_rules_hint = /** @type {(inputs: Setting_Status_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON: default, escalate_when и список rules из пар status/when.`)
};

const kk_setting_status_rules_hint = /** @type {(inputs: Setting_Status_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON: default, escalate_when және status/when жұптарынан тұратын rules тізімі.`)
};

const en_setting_status_rules_hint = /** @type {(inputs: Setting_Status_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON: default, escalate_when and a list of status/when rules.`)
};

/**
* | output |
* | --- |
* | "JSON: default, escalate_when and a list of status/when rules." |
*
* @param {Setting_Status_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_status_rules_hint = /** @type {((inputs?: Setting_Status_Rules_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Status_Rules_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_status_rules_hint(inputs)
	if (locale === "en") return en_setting_status_rules_hint(inputs)
	return ru_setting_status_rules_hint(inputs)
});