/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Footer_About_TitleInputs */

const ru_footer_about_title = /** @type {(inputs: Footer_About_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`О дашборде`)
};

const kk_footer_about_title = /** @type {(inputs: Footer_About_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дашборд туралы`)
};

const en_footer_about_title = /** @type {(inputs: Footer_About_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`About this dashboard`)
};

/**
* | output |
* | --- |
* | "About this dashboard" |
*
* @param {Footer_About_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_about_title = /** @type {((inputs?: Footer_About_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_About_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_footer_about_title(inputs)
	if (locale === "en") return en_footer_about_title(inputs)
	return ru_footer_about_title(inputs)
});