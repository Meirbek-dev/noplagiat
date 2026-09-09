/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Kpi_Below_Threshold_HintInputs */

const ru_kpi_below_threshold_hint = /** @type {(inputs: Kpi_Below_Threshold_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Проверок ниже порога: ${i?.count}`)
};

const kk_kpi_below_threshold_hint = /** @type {(inputs: Kpi_Below_Threshold_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Шектен төмен тексерулер саны: ${i?.count}`)
};

const en_kpi_below_threshold_hint = /** @type {(inputs: Kpi_Below_Threshold_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Checks below the threshold: ${i?.count}`)
};

/**
* | output |
* | --- |
* | "Checks below the threshold: {count}" |
*
* @param {Kpi_Below_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_below_threshold_hint = /** @type {((inputs: Kpi_Below_Threshold_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Below_Threshold_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_below_threshold_hint(inputs)
	if (locale === "en") return en_kpi_below_threshold_hint(inputs)
	return ru_kpi_below_threshold_hint(inputs)
});