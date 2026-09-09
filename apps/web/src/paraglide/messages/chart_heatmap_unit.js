/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Heatmap_UnitInputs */

const ru_chart_heatmap_unit = /** @type {(inputs: Chart_Heatmap_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Подразделение`)
};

const kk_chart_heatmap_unit = /** @type {(inputs: Chart_Heatmap_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімше`)
};

const en_chart_heatmap_unit = /** @type {(inputs: Chart_Heatmap_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit`)
};

/**
* | output |
* | --- |
* | "Unit" |
*
* @param {Chart_Heatmap_UnitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_heatmap_unit = /** @type {((inputs?: Chart_Heatmap_UnitInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Heatmap_UnitInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_heatmap_unit(inputs)
	if (locale === "en") return en_chart_heatmap_unit(inputs)
	return ru_chart_heatmap_unit(inputs)
});