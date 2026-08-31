/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Settings_HintInputs */

const ru_admin_settings_hint = /** @type {(inputs: Admin_Settings_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пороги, границы семестров и правила вывода. Изменение применяется к API сразу.`)
};

const kk_admin_settings_hint = /** @type {(inputs: Admin_Settings_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шектер, семестр шекаралары және шығару ережелері. Өзгеріс API-ге бірден қолданылады.`)
};

const en_admin_settings_hint = /** @type {(inputs: Admin_Settings_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Thresholds, semester boundaries and derivation rules. A change reaches the API immediately.`)
};

/**
* | output |
* | --- |
* | "Thresholds, semester boundaries and derivation rules. A change reaches the API immediately." |
*
* @param {Admin_Settings_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_settings_hint = /** @type {((inputs?: Admin_Settings_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Settings_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_settings_hint(inputs)
	if (locale === "en") return en_admin_settings_hint(inputs)
	return ru_admin_settings_hint(inputs)
});