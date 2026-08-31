/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Footer_Sections_TitleInputs */

const ru_footer_sections_title = /** @type {(inputs: Footer_Sections_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разделы`)
};

const kk_footer_sections_title = /** @type {(inputs: Footer_Sections_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімдер`)
};

const en_footer_sections_title = /** @type {(inputs: Footer_Sections_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sections`)
};

/**
* | output |
* | --- |
* | "Sections" |
*
* @param {Footer_Sections_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_sections_title = /** @type {((inputs?: Footer_Sections_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_Sections_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_footer_sections_title(inputs)
	if (locale === "en") return en_footer_sections_title(inputs)
	return ru_footer_sections_title(inputs)
});