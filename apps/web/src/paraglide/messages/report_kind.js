/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_KindInputs */

const ru_report_kind = /** @type {(inputs: Report_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вид отчёта`)
};

const kk_report_kind = /** @type {(inputs: Report_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есеп түрі`)
};

const en_report_kind = /** @type {(inputs: Report_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Report kind`)
};

/**
* | output |
* | --- |
* | "Report kind" |
*
* @param {Report_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_kind = /** @type {((inputs?: Report_KindInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_KindInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_kind(inputs)
	if (locale === "en") return en_report_kind(inputs)
	return ru_report_kind(inputs)
});