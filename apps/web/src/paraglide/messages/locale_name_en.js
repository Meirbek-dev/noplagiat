/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Locale_Name_EnInputs */

const ru_locale_name_en = /** @type {(inputs: Locale_Name_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`English`)
};

const kk_locale_name_en = /** @type {(inputs: Locale_Name_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`English`)
};

const en_locale_name_en = /** @type {(inputs: Locale_Name_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`English`)
};

/**
* | output |
* | --- |
* | "English" |
*
* @param {Locale_Name_EnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const locale_name_en = /** @type {((inputs?: Locale_Name_EnInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Locale_Name_EnInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_locale_name_en(inputs)
	if (locale === "en") return en_locale_name_en(inputs)
	return ru_locale_name_en(inputs)
});