/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_FacultyInputs */

const ru_chart_axis_faculty = /** @type {(inputs: Chart_Axis_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет`)
};

const kk_chart_axis_faculty = /** @type {(inputs: Chart_Axis_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет`)
};

const en_chart_axis_faculty = /** @type {(inputs: Chart_Axis_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faculty`)
};

/**
* | output |
* | --- |
* | "Faculty" |
*
* @param {Chart_Axis_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_faculty = /** @type {((inputs?: Chart_Axis_FacultyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_FacultyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_faculty(inputs)
	if (locale === "en") return en_chart_axis_faculty(inputs)
	return ru_chart_axis_faculty(inputs)
});