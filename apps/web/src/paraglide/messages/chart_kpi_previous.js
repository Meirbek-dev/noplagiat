/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Kpi_PreviousInputs */

const ru_chart_kpi_previous = /** @type {(inputs: Chart_Kpi_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`к предыдущему периоду`)
};

const kk_chart_kpi_previous = /** @type {(inputs: Chart_Kpi_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`алдыңғы кезеңмен салыстырғанда`)
};

const en_chart_kpi_previous = /** @type {(inputs: Chart_Kpi_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`vs previous period`)
};

/**
* | output |
* | --- |
* | "vs previous period" |
*
* @param {Chart_Kpi_PreviousInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_previous = /** @type {((inputs?: Chart_Kpi_PreviousInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_PreviousInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_kpi_previous(inputs)
	if (locale === "en") return en_chart_kpi_previous(inputs)
	return ru_chart_kpi_previous(inputs)
});