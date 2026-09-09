/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Chart_Semester_AutumnInputs */

const ru_chart_semester_autumn = /** @type {(inputs: Chart_Semester_AutumnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Осенний семестр ${i?.year}`)
};

const kk_chart_semester_autumn = /** @type {(inputs: Chart_Semester_AutumnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.year} күзгі семестрі`)
};

const en_chart_semester_autumn = /** @type {(inputs: Chart_Semester_AutumnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Autumn semester ${i?.year}`)
};

/**
* | output |
* | --- |
* | "Autumn semester {year}" |
*
* @param {Chart_Semester_AutumnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_autumn = /** @type {((inputs: Chart_Semester_AutumnInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Semester_AutumnInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_semester_autumn(inputs)
	if (locale === "en") return en_chart_semester_autumn(inputs)
	return ru_chart_semester_autumn(inputs)
});