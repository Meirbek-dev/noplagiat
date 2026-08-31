/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_Work_TypeInputs */

const ru_chart_axis_work_type = /** @type {(inputs: Chart_Axis_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тип работы`)
};

const kk_chart_axis_work_type = /** @type {(inputs: Chart_Axis_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрі`)
};

const en_chart_axis_work_type = /** @type {(inputs: Chart_Axis_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work type`)
};

/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Chart_Axis_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_work_type = /** @type {((inputs?: Chart_Axis_Work_TypeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_Work_TypeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_work_type(inputs)
	if (locale === "en") return en_chart_axis_work_type(inputs)
	return ru_chart_axis_work_type(inputs)
});