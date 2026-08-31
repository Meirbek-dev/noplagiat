/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Rechecks_HintInputs */

const ru_section_rechecks_hint = /** @type {(inputs: Section_Rechecks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Доля работ, прошедших повторную проверку после доработки, и доля с улучшением показателя.`)
};

const kk_section_rechecks_hint = /** @type {(inputs: Section_Rechecks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пысықтаудан кейін қайта тексеруден өткен жұмыстар үлесі және көрсеткіші жақсарғандарының үлесі.`)
};

const en_section_rechecks_hint = /** @type {(inputs: Section_Rechecks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The share of works rechecked after revision, and how many of them improved.`)
};

/**
* | output |
* | --- |
* | "The share of works rechecked after revision, and how many of them improved." |
*
* @param {Section_Rechecks_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_rechecks_hint = /** @type {((inputs?: Section_Rechecks_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Rechecks_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_rechecks_hint(inputs)
	if (locale === "en") return en_section_rechecks_hint(inputs)
	return ru_section_rechecks_hint(inputs)
});