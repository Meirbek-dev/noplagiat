/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ delta: NonNullable<unknown> }} Chart_Kpi_Delta_UpInputs */

const ru_chart_kpi_delta_up = /** @type {(inputs: Chart_Kpi_Delta_UpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`рост на ${i?.delta}`)
};

const kk_chart_kpi_delta_up = /** @type {(inputs: Chart_Kpi_Delta_UpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.delta} өсім`)
};

const en_chart_kpi_delta_up = /** @type {(inputs: Chart_Kpi_Delta_UpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`up by ${i?.delta}`)
};

/**
* | output |
* | --- |
* | "up by {delta}" |
*
* @param {Chart_Kpi_Delta_UpInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_kpi_delta_up = /** @type {((inputs: Chart_Kpi_Delta_UpInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Kpi_Delta_UpInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_kpi_delta_up(inputs)
	if (locale === "en") return en_chart_kpi_delta_up(inputs)
	return ru_chart_kpi_delta_up(inputs)
});