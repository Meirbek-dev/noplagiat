/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_CoverageInputs */

const ru_kpi_coverage = /** @type {(inputs: Kpi_CoverageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Охват проверками`)
};

const kk_kpi_coverage = /** @type {(inputs: Kpi_CoverageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерумен қамту`)
};

const en_kpi_coverage = /** @type {(inputs: Kpi_CoverageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check coverage`)
};

/**
* | output |
* | --- |
* | "Check coverage" |
*
* @param {Kpi_CoverageInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_coverage = /** @type {((inputs?: Kpi_CoverageInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_CoverageInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_coverage(inputs)
	if (locale === "en") return en_kpi_coverage(inputs)
	return ru_kpi_coverage(inputs)
});