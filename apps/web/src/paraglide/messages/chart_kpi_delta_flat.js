/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Kpi_Delta_FlatInputs */

const ru_chart_kpi_delta_flat = /** @type {(inputs: Chart_Kpi_Delta_FlatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`без изменений`)
};

const kk_chart_kpi_delta_flat = /** @type {(inputs: Chart_Kpi_Delta_FlatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`өзгеріссіз`)
};

const en_chart_kpi_delta_flat = /** @type {(inputs: Chart_Kpi_Delta_FlatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no change`)
};

/**
* | output |
* | --- |
* | "no change" |
*
* @param {Chart_Kpi_Delta_FlatInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_flat = /** @type {((inputs?: Chart_Kpi_Delta_FlatInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_Delta_FlatInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_kpi_delta_flat(inputs)
	if (locale === "en") return en_chart_kpi_delta_flat(inputs)
	return ru_chart_kpi_delta_flat(inputs)
});