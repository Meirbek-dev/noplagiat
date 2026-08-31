/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Generate_HintInputs */

const ru_report_generate_hint = /** @type {(inputs: Report_Generate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Годовой отчёт - с 1 сентября по 31 августа; отчёт за период - произвольный диапазон дат.`)
};

const kk_report_generate_hint = /** @type {(inputs: Report_Generate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдық есеп - 1 қыркүйектен 31 тамызға дейін; кезеңдік есеп - еркін күндер аралығы.`)
};

const en_report_generate_hint = /** @type {(inputs: Report_Generate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The annual report runs 1 September – 31 August; a manual report takes any date range.`)
};

/**
* | output |
* | --- |
* | "The annual report runs 1 September – 31 August; a manual report takes any date range." |
*
* @param {Report_Generate_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generate_hint = /** @type {((inputs?: Report_Generate_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Generate_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_generate_hint(inputs)
	if (locale === "en") return en_report_generate_hint(inputs)
	return ru_report_generate_hint(inputs)
});