/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_HistogramInputs */

const ru_section_histogram = /** @type {(inputs: Section_HistogramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Распределение оригинальности`)
};

const kk_section_histogram = /** @type {(inputs: Section_HistogramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірегейлік үлестірімі`)
};

const en_section_histogram = /** @type {(inputs: Section_HistogramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality distribution`)
};

/**
* | output |
* | --- |
* | "Originality distribution" |
*
* @param {Section_HistogramInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_histogram = /** @type {((inputs?: Section_HistogramInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_HistogramInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_histogram(inputs)
	if (locale === "en") return en_section_histogram(inputs)
	return ru_section_histogram(inputs)
});