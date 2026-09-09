/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_SettingsInputs */

const ru_admin_settings = /** @type {(inputs: Admin_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Настройки`)
};

const kk_admin_settings = /** @type {(inputs: Admin_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Баптаулар`)
};

const en_admin_settings = /** @type {(inputs: Admin_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings`)
};

/**
* | output |
* | --- |
* | "Settings" |
*
* @param {Admin_SettingsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_settings = /** @type {((inputs?: Admin_SettingsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_SettingsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_settings(inputs)
	if (locale === "en") return en_admin_settings(inputs)
	return ru_admin_settings(inputs)
});