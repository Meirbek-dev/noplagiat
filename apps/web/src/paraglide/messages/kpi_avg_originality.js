/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Avg_OriginalityInputs */

const ru_kpi_avg_originality = /** @type {(inputs: Kpi_Avg_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Средняя оригинальность`)
};

const kk_kpi_avg_originality = /** @type {(inputs: Kpi_Avg_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Орташа бірегейлік`)
};

const en_kpi_avg_originality = /** @type {(inputs: Kpi_Avg_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average originality`)
};

/**
* | output |
* | --- |
* | "Average originality" |
*
* @param {Kpi_Avg_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_avg_originality = /** @type {((inputs?: Kpi_Avg_OriginalityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Avg_OriginalityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_avg_originality(inputs)
	if (locale === "en") return en_kpi_avg_originality(inputs)
	return ru_kpi_avg_originality(inputs)
});