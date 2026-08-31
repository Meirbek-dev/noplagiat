/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Coverage_HintInputs */

const ru_kpi_coverage_hint = /** @type {(inputs: Kpi_Coverage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Доля сданных работ, прошедших проверку`)
};

const kk_kpi_coverage_hint = /** @type {(inputs: Kpi_Coverage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексеруден өткен тапсырылған жұмыстардың үлесі`)
};

const en_kpi_coverage_hint = /** @type {(inputs: Kpi_Coverage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Share of submitted works that were checked`)
};

/**
* | output |
* | --- |
* | "Share of submitted works that were checked" |
*
* @param {Kpi_Coverage_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_coverage_hint = /** @type {((inputs?: Kpi_Coverage_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Coverage_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_coverage_hint(inputs)
	if (locale === "en") return en_kpi_coverage_hint(inputs)
	return ru_kpi_coverage_hint(inputs)
});