/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Avg_Originality_HintInputs */

const ru_kpi_avg_originality_hint = /** @type {(inputs: Kpi_Avg_Originality_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Среднее по всем проверкам периода`)
};

const kk_kpi_avg_originality_hint = /** @type {(inputs: Kpi_Avg_Originality_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезеңдегі барлық тексерулер бойынша орташа мән`)
};

const en_kpi_avg_originality_hint = /** @type {(inputs: Kpi_Avg_Originality_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mean across every check in the period`)
};

/**
* | output |
* | --- |
* | "Mean across every check in the period" |
*
* @param {Kpi_Avg_Originality_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_avg_originality_hint = /** @type {((inputs?: Kpi_Avg_Originality_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Avg_Originality_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_avg_originality_hint(inputs)
	if (locale === "en") return en_kpi_avg_originality_hint(inputs)
	return ru_kpi_avg_originality_hint(inputs)
});