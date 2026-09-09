/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Locale_Name_RuInputs */

const ru_locale_name_ru = /** @type {(inputs: Locale_Name_RuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Русский`)
};

const kk_locale_name_ru = /** @type {(inputs: Locale_Name_RuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Русский`)
};

const en_locale_name_ru = /** @type {(inputs: Locale_Name_RuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Русский`)
};

/**
* | output |
* | --- |
* | "Русский" |
*
* @param {Locale_Name_RuInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_ru = /** @type {((inputs?: Locale_Name_RuInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Locale_Name_RuInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_locale_name_ru(inputs)
	if (locale === "en") return en_locale_name_ru(inputs)
	return ru_locale_name_ru(inputs)
});