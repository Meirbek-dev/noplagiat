/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_NoneInputs */

const ru_report_none = /** @type {(inputs: Report_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отчёты ещё не формировались.`)
};

const kk_report_none = /** @type {(inputs: Report_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есептер әлі қалыптастырылмаған.`)
};

const en_report_none = /** @type {(inputs: Report_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No reports have been generated yet.`)
};

/**
* | output |
* | --- |
* | "No reports have been generated yet." |
*
* @param {Report_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_none = /** @type {((inputs?: Report_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_none(inputs)
	if (locale === "en") return en_report_none(inputs)
	return ru_report_none(inputs)
});