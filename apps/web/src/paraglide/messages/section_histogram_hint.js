/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Histogram_HintInputs */

const ru_section_histogram_hint = /** @type {(inputs: Section_Histogram_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Распределение проверок по диапазонам показателя оригинальности.`)
};

const kk_section_histogram_hint = /** @type {(inputs: Section_Histogram_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерулердің бірегейлік көрсеткішінің ауқымдары бойынша үлестірімі.`)
};

const en_section_histogram_hint = /** @type {(inputs: Section_Histogram_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How checks are distributed across the originality bands.`)
};

/**
* | output |
* | --- |
* | "How checks are distributed across the originality bands." |
*
* @param {Section_Histogram_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_histogram_hint = /** @type {((inputs?: Section_Histogram_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Histogram_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_histogram_hint(inputs)
	if (locale === "en") return en_section_histogram_hint(inputs)
	return ru_section_histogram_hint(inputs)
});