/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Error_UnavailableInputs */

const ru_section_error_unavailable = /** @type {(inputs: Section_Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сервис временно недоступен.`)
};

const kk_section_error_unavailable = /** @type {(inputs: Section_Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қызмет уақытша қолжетімсіз.`)
};

const en_section_error_unavailable = /** @type {(inputs: Section_Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The service is temporarily unavailable.`)
};

/**
* | output |
* | --- |
* | "The service is temporarily unavailable." |
*
* @param {Section_Error_UnavailableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_error_unavailable = /** @type {((inputs?: Section_Error_UnavailableInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Error_UnavailableInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_error_unavailable(inputs)
	if (locale === "en") return en_section_error_unavailable(inputs)
	return ru_section_error_unavailable(inputs)
});