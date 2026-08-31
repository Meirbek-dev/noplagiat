/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Chart_Semester_SpringInputs */

const ru_chart_semester_spring = /** @type {(inputs: Chart_Semester_SpringInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Весенний семестр ${i?.year}`)
};

const kk_chart_semester_spring = /** @type {(inputs: Chart_Semester_SpringInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.year} көктемгі семестрі`)
};

const en_chart_semester_spring = /** @type {(inputs: Chart_Semester_SpringInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Spring semester ${i?.year}`)
};

/**
* | output |
* | --- |
* | "Spring semester {year}" |
*
* @param {Chart_Semester_SpringInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_spring = /** @type {((inputs: Chart_Semester_SpringInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Semester_SpringInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_semester_spring(inputs)
	if (locale === "en") return en_chart_semester_spring(inputs)
	return ru_chart_semester_spring(inputs)
});