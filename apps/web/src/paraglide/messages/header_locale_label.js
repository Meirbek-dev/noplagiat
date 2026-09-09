/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Header_Locale_LabelInputs */

const ru_header_locale_label = /** @type {(inputs: Header_Locale_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Язык интерфейса`)
};

const kk_header_locale_label = /** @type {(inputs: Header_Locale_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Интерфейс тілі`)
};

const en_header_locale_label = /** @type {(inputs: Header_Locale_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Interface language`)
};

/**
* | output |
* | --- |
* | "Interface language" |
*
* @param {Header_Locale_LabelInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const header_locale_label = /** @type {((inputs?: Header_Locale_LabelInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Header_Locale_LabelInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_header_locale_label(inputs)
	if (locale === "en") return en_header_locale_label(inputs)
	return ru_header_locale_label(inputs)
});