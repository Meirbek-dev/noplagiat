/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_UnchangedInputs */

const ru_settings_unchanged = /** @type {(inputs: Settings_UnchangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Изменений нет`)
};

const kk_settings_unchanged = /** @type {(inputs: Settings_UnchangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өзгеріс жоқ`)
};

const en_settings_unchanged = /** @type {(inputs: Settings_UnchangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing changed`)
};

/**
* | output |
* | --- |
* | "Nothing changed" |
*
* @param {Settings_UnchangedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_unchanged = /** @type {((inputs?: Settings_UnchangedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_UnchangedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_settings_unchanged(inputs)
	if (locale === "en") return en_settings_unchanged(inputs)
	return ru_settings_unchanged(inputs)
});