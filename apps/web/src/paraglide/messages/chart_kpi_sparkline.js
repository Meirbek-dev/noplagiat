/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Kpi_SparklineInputs */

const ru_chart_kpi_sparkline = /** @type {(inputs: Chart_Kpi_SparklineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Динамика за период`)
};

const kk_chart_kpi_sparkline = /** @type {(inputs: Chart_Kpi_SparklineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезең ішіндегі динамика`)
};

const en_chart_kpi_sparkline = /** @type {(inputs: Chart_Kpi_SparklineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trend over the period`)
};

/**
* | output |
* | --- |
* | "Trend over the period" |
*
* @param {Chart_Kpi_SparklineInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_sparkline = /** @type {((inputs?: Chart_Kpi_SparklineInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_SparklineInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_kpi_sparkline(inputs)
	if (locale === "en") return en_chart_kpi_sparkline(inputs)
	return ru_chart_kpi_sparkline(inputs)
});