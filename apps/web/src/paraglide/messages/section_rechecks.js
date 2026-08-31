/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_RechecksInputs */

const ru_section_rechecks = /** @type {(inputs: Section_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Повторные проверки`)
};

const kk_section_rechecks = /** @type {(inputs: Section_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексерулер`)
};

const en_section_rechecks = /** @type {(inputs: Section_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechecks`)
};

/**
* | output |
* | --- |
* | "Rechecks" |
*
* @param {Section_RechecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_rechecks = /** @type {((inputs?: Section_RechecksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_RechecksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_rechecks(inputs)
	if (locale === "en") return en_section_rechecks(inputs)
	return ru_section_rechecks(inputs)
});