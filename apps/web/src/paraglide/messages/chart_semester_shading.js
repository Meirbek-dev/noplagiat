/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Semester_ShadingInputs */

const ru_chart_semester_shading = /** @type {(inputs: Chart_Semester_ShadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Затенение - осенний семестр`)
};

const kk_chart_semester_shading = /** @type {(inputs: Chart_Semester_ShadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Көлеңкелеу - күзгі семестр`)
};

const en_chart_semester_shading = /** @type {(inputs: Chart_Semester_ShadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shading marks the autumn semester`)
};

/**
* | output |
* | --- |
* | "Shading marks the autumn semester" |
*
* @param {Chart_Semester_ShadingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_semester_shading = /** @type {((inputs?: Chart_Semester_ShadingInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Semester_ShadingInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_semester_shading(inputs)
	if (locale === "en") return en_chart_semester_shading(inputs)
	return ru_chart_semester_shading(inputs)
});