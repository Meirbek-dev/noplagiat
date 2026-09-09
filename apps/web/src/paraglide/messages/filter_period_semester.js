/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Period_SemesterInputs */

const ru_filter_period_semester = /** @type {(inputs: Filter_Period_SemesterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Семестр`)
};

const kk_filter_period_semester = /** @type {(inputs: Filter_Period_SemesterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Семестр`)
};

const en_filter_period_semester = /** @type {(inputs: Filter_Period_SemesterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Semester`)
};

/**
* | output |
* | --- |
* | "Semester" |
*
* @param {Filter_Period_SemesterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_semester = /** @type {((inputs?: Filter_Period_SemesterInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_SemesterInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_period_semester(inputs)
	if (locale === "en") return en_filter_period_semester(inputs)
	return ru_filter_period_semester(inputs)
});