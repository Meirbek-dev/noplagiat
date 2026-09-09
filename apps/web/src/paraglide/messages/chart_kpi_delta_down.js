/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ delta: NonNullable<unknown> }} Chart_Kpi_Delta_DownInputs */

const ru_chart_kpi_delta_down = /** @type {(inputs: Chart_Kpi_Delta_DownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`снижение на ${i?.delta}`)
};

const kk_chart_kpi_delta_down = /** @type {(inputs: Chart_Kpi_Delta_DownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.delta} төмендеу`)
};

const en_chart_kpi_delta_down = /** @type {(inputs: Chart_Kpi_Delta_DownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`down by ${i?.delta}`)
};

/**
* | output |
* | --- |
* | "down by {delta}" |
*
* @param {Chart_Kpi_Delta_DownInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_down = /** @type {((inputs: Chart_Kpi_Delta_DownInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_Delta_DownInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_kpi_delta_down(inputs)
	if (locale === "en") return en_chart_kpi_delta_down(inputs)
	return ru_chart_kpi_delta_down(inputs)
});