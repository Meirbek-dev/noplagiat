/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_ValueInputs */

const ru_chart_axis_value = /** @type {(inputs: Chart_Axis_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Значение`)
};

const kk_chart_axis_value = /** @type {(inputs: Chart_Axis_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мәні`)
};

const en_chart_axis_value = /** @type {(inputs: Chart_Axis_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value`)
};

/**
* | output |
* | --- |
* | "Value" |
*
* @param {Chart_Axis_ValueInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_value = /** @type {((inputs?: Chart_Axis_ValueInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_ValueInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_value(inputs)
	if (locale === "en") return en_chart_axis_value(inputs)
	return ru_chart_axis_value(inputs)
});