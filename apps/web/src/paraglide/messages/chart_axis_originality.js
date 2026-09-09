/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_OriginalityInputs */

const ru_chart_axis_originality = /** @type {(inputs: Chart_Axis_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оригинальность, %`)
};

const kk_chart_axis_originality = /** @type {(inputs: Chart_Axis_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірегейлік, %`)
};

const en_chart_axis_originality = /** @type {(inputs: Chart_Axis_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality, %`)
};

/**
* | output |
* | --- |
* | "Originality, %" |
*
* @param {Chart_Axis_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_originality = /** @type {((inputs?: Chart_Axis_OriginalityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_OriginalityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_originality(inputs)
	if (locale === "en") return en_chart_axis_originality(inputs)
	return ru_chart_axis_originality(inputs)
});