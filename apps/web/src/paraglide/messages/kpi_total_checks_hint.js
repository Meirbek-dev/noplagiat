/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Total_Checks_HintInputs */

const ru_kpi_total_checks_hint = /** @type {(inputs: Kpi_Total_Checks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`За выбранный период`)
};

const kk_kpi_total_checks_hint = /** @type {(inputs: Kpi_Total_Checks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған кезең үшін`)
};

const en_kpi_total_checks_hint = /** @type {(inputs: Kpi_Total_Checks_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`For the selected period`)
};

/**
* | output |
* | --- |
* | "For the selected period" |
*
* @param {Kpi_Total_Checks_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_total_checks_hint = /** @type {((inputs?: Kpi_Total_Checks_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Total_Checks_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_total_checks_hint(inputs)
	if (locale === "en") return en_kpi_total_checks_hint(inputs)
	return ru_kpi_total_checks_hint(inputs)
});