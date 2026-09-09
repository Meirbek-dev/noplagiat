/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_CategoryInputs */

const ru_chart_axis_category = /** @type {(inputs: Chart_Axis_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Категория`)
};

const kk_chart_axis_category = /** @type {(inputs: Chart_Axis_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Санат`)
};

const en_chart_axis_category = /** @type {(inputs: Chart_Axis_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Category`)
};

/**
* | output |
* | --- |
* | "Category" |
*
* @param {Chart_Axis_CategoryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_category = /** @type {((inputs?: Chart_Axis_CategoryInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_CategoryInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_category(inputs)
	if (locale === "en") return en_chart_axis_category(inputs)
	return ru_chart_axis_category(inputs)
});