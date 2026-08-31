/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Works_Total_HintInputs */

const ru_kpi_works_total_hint = /** @type {(inputs: Kpi_Works_Total_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Уникальных работ за период`)
};

const kk_kpi_works_total_hint = /** @type {(inputs: Kpi_Works_Total_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезеңдегі бірегей жұмыстар`)
};

const en_kpi_works_total_hint = /** @type {(inputs: Kpi_Works_Total_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Distinct works in the period`)
};

/**
* | output |
* | --- |
* | "Distinct works in the period" |
*
* @param {Kpi_Works_Total_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_total_hint = /** @type {((inputs?: Kpi_Works_Total_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Works_Total_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_works_total_hint(inputs)
	if (locale === "en") return en_kpi_works_total_hint(inputs)
	return ru_kpi_works_total_hint(inputs)
});