/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Total_ChecksInputs */

const ru_kpi_total_checks = /** @type {(inputs: Kpi_Total_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Всего проверок`)
};

const kk_kpi_total_checks = /** @type {(inputs: Kpi_Total_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық тексерулер`)
};

const en_kpi_total_checks = /** @type {(inputs: Kpi_Total_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total checks`)
};

/**
* | output |
* | --- |
* | "Total checks" |
*
* @param {Kpi_Total_ChecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_total_checks = /** @type {((inputs?: Kpi_Total_ChecksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Total_ChecksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_total_checks(inputs)
	if (locale === "en") return en_kpi_total_checks(inputs)
	return ru_kpi_total_checks(inputs)
});