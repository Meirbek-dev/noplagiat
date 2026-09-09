/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Below_ThresholdInputs */

const ru_kpi_below_threshold = /** @type {(inputs: Kpi_Below_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Доля работ ниже порога`)
};

const kk_kpi_below_threshold = /** @type {(inputs: Kpi_Below_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шектен төмен жұмыстардың үлесі`)
};

const en_kpi_below_threshold = /** @type {(inputs: Kpi_Below_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Share below the threshold`)
};

/**
* | output |
* | --- |
* | "Share below the threshold" |
*
* @param {Kpi_Below_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_below_threshold = /** @type {((inputs?: Kpi_Below_ThresholdInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Below_ThresholdInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_below_threshold(inputs)
	if (locale === "en") return en_kpi_below_threshold(inputs)
	return ru_kpi_below_threshold(inputs)
});