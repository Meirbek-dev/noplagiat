/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reports_EmptyInputs */

const ru_reports_empty = /** @type {(inputs: Reports_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отчёты ещё не опубликованы.`)
};

const kk_reports_empty = /** @type {(inputs: Reports_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есептер әлі жарияланған жоқ.`)
};

const en_reports_empty = /** @type {(inputs: Reports_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No reports have been published yet.`)
};

/**
* | output |
* | --- |
* | "No reports have been published yet." |
*
* @param {Reports_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_empty = /** @type {((inputs?: Reports_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_reports_empty(inputs)
	if (locale === "en") return en_reports_empty(inputs)
	return ru_reports_empty(inputs)
});