/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_Academic_YearInputs */

const ru_chart_axis_academic_year = /** @type {(inputs: Chart_Axis_Academic_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Учебный год`)
};

const kk_chart_axis_academic_year = /** @type {(inputs: Chart_Axis_Academic_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оқу жылы`)
};

const en_chart_axis_academic_year = /** @type {(inputs: Chart_Axis_Academic_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic year`)
};

/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Chart_Axis_Academic_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_academic_year = /** @type {((inputs?: Chart_Axis_Academic_YearInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_Academic_YearInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_academic_year(inputs)
	if (locale === "en") return en_chart_axis_academic_year(inputs)
	return ru_chart_axis_academic_year(inputs)
});