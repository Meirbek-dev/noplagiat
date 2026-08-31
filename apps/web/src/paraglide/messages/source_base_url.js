/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Base_UrlInputs */

const ru_source_base_url = /** @type {(inputs: Source_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Адрес источника`)
};

const kk_source_base_url = /** @type {(inputs: Source_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дереккөз мекенжайы`)
};

const en_source_base_url = /** @type {(inputs: Source_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source address`)
};

/**
* | output |
* | --- |
* | "Source address" |
*
* @param {Source_Base_UrlInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_base_url = /** @type {((inputs?: Source_Base_UrlInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Base_UrlInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_base_url(inputs)
	if (locale === "en") return en_source_base_url(inputs)
	return ru_source_base_url(inputs)
});