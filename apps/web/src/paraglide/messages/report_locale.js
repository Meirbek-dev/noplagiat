/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_LocaleInputs */

const ru_report_locale = /** @type {(inputs: Report_LocaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Язык отчёта`)
};

const kk_report_locale = /** @type {(inputs: Report_LocaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есеп тілі`)
};

const en_report_locale = /** @type {(inputs: Report_LocaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Report language`)
};

/**
* | output |
* | --- |
* | "Report language" |
*
* @param {Report_LocaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_locale = /** @type {((inputs?: Report_LocaleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_LocaleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_locale(inputs)
	if (locale === "en") return en_report_locale(inputs)
	return ru_report_locale(inputs)
});