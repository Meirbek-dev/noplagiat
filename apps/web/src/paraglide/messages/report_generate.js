/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_GenerateInputs */

const ru_report_generate = /** @type {(inputs: Report_GenerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сформировать отчёт`)
};

const kk_report_generate = /** @type {(inputs: Report_GenerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есеп қалыптастыру`)
};

const en_report_generate = /** @type {(inputs: Report_GenerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Generate report`)
};

/**
* | output |
* | --- |
* | "Generate report" |
*
* @param {Report_GenerateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generate = /** @type {((inputs?: Report_GenerateInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_GenerateInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_generate(inputs)
	if (locale === "en") return en_report_generate(inputs)
	return ru_report_generate(inputs)
});