/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_CountInputs */

const ru_chart_axis_count = /** @type {(inputs: Chart_Axis_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Количество проверок`)
};

const kk_chart_axis_count = /** @type {(inputs: Chart_Axis_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерулер саны`)
};

const en_chart_axis_count = /** @type {(inputs: Chart_Axis_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Number of checks`)
};

/**
* | output |
* | --- |
* | "Number of checks" |
*
* @param {Chart_Axis_CountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_count = /** @type {((inputs?: Chart_Axis_CountInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_CountInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_count(inputs)
	if (locale === "en") return en_chart_axis_count(inputs)
	return ru_chart_axis_count(inputs)
});