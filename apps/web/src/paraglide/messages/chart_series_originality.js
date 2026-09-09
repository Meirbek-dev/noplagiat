/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Series_OriginalityInputs */

const ru_chart_series_originality = /** @type {(inputs: Chart_Series_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Средняя оригинальность`)
};

const kk_chart_series_originality = /** @type {(inputs: Chart_Series_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Орташа бірегейлік`)
};

const en_chart_series_originality = /** @type {(inputs: Chart_Series_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average originality`)
};

/**
* | output |
* | --- |
* | "Average originality" |
*
* @param {Chart_Series_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_originality = /** @type {((inputs?: Chart_Series_OriginalityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Series_OriginalityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_series_originality(inputs)
	if (locale === "en") return en_chart_series_originality(inputs)
	return ru_chart_series_originality(inputs)
});