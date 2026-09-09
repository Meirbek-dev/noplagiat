/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Generated_OkInputs */

const ru_report_generated_ok = /** @type {(inputs: Report_Generated_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отчёт сформирован`)
};

const kk_report_generated_ok = /** @type {(inputs: Report_Generated_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есеп қалыптастырылды`)
};

const en_report_generated_ok = /** @type {(inputs: Report_Generated_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The report has been generated`)
};

/**
* | output |
* | --- |
* | "The report has been generated" |
*
* @param {Report_Generated_OkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generated_ok = /** @type {((inputs?: Report_Generated_OkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Generated_OkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_generated_ok(inputs)
	if (locale === "en") return en_report_generated_ok(inputs)
	return ru_report_generated_ok(inputs)
});