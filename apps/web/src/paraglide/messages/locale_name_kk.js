/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Locale_Name_KkInputs */

const ru_locale_name_kk = /** @type {(inputs: Locale_Name_KkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қазақша`)
};

const kk_locale_name_kk = /** @type {(inputs: Locale_Name_KkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қазақша`)
};

const en_locale_name_kk = /** @type {(inputs: Locale_Name_KkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қазақша`)
};

/**
* | output |
* | --- |
* | "Қазақша" |
*
* @param {Locale_Name_KkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_kk = /** @type {((inputs?: Locale_Name_KkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Locale_Name_KkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_locale_name_kk(inputs)
	if (locale === "en") return en_locale_name_kk(inputs)
	return ru_locale_name_kk(inputs)
});