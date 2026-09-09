/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Works_TotalInputs */

const ru_kpi_works_total = /** @type {(inputs: Kpi_Works_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Всего работ`)
};

const kk_kpi_works_total = /** @type {(inputs: Kpi_Works_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық жұмыс`)
};

const en_kpi_works_total = /** @type {(inputs: Kpi_Works_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Works in total`)
};

/**
* | output |
* | --- |
* | "Works in total" |
*
* @param {Kpi_Works_TotalInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_total = /** @type {((inputs?: Kpi_Works_TotalInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Works_TotalInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_works_total(inputs)
	if (locale === "en") return en_kpi_works_total(inputs)
	return ru_kpi_works_total(inputs)
});