/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Semester_BandsInputs */

const ru_chart_semester_bands = /** @type {(inputs: Chart_Semester_BandsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Границы семестров`)
};

const kk_chart_semester_bands = /** @type {(inputs: Chart_Semester_BandsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Семестр шекаралары`)
};

const en_chart_semester_bands = /** @type {(inputs: Chart_Semester_BandsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Semester boundaries`)
};

/**
* | output |
* | --- |
* | "Semester boundaries" |
*
* @param {Chart_Semester_BandsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_bands = /** @type {((inputs?: Chart_Semester_BandsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Semester_BandsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_semester_bands(inputs)
	if (locale === "en") return en_chart_semester_bands(inputs)
	return ru_chart_semester_bands(inputs)
});