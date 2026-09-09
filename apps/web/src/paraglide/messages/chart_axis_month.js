/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_MonthInputs */

const ru_chart_axis_month = /** @type {(inputs: Chart_Axis_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Месяц`)
};

const kk_chart_axis_month = /** @type {(inputs: Chart_Axis_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ай`)
};

const en_chart_axis_month = /** @type {(inputs: Chart_Axis_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Month`)
};

/**
* | output |
* | --- |
* | "Month" |
*
* @param {Chart_Axis_MonthInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_month = /** @type {((inputs?: Chart_Axis_MonthInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_MonthInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_month(inputs)
	if (locale === "en") return en_chart_axis_month(inputs)
	return ru_chart_axis_month(inputs)
});