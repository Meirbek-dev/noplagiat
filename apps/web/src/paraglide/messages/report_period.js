/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_PeriodInputs */

const ru_report_period = /** @type {(inputs: Report_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Период`)
};

const kk_report_period = /** @type {(inputs: Report_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезең`)
};

const en_report_period = /** @type {(inputs: Report_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period`)
};

/**
* | output |
* | --- |
* | "Period" |
*
* @param {Report_PeriodInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_period = /** @type {((inputs?: Report_PeriodInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_PeriodInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_period(inputs)
	if (locale === "en") return en_report_period(inputs)
	return ru_report_period(inputs)
});