/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Heatmap_ScaleInputs */

const ru_chart_heatmap_scale = /** @type {(inputs: Chart_Heatmap_ScaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Цветовая шкала: от наименьшего к наибольшему значению в столбце`)
};

const kk_chart_heatmap_scale = /** @type {(inputs: Chart_Heatmap_ScaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Түс шкаласы: бағандағы ең кіші мәннен ең үлкен мәнге дейін`)
};

const en_chart_heatmap_scale = /** @type {(inputs: Chart_Heatmap_ScaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Colour scale: from the lowest to the highest value in the column`)
};

/**
* | output |
* | --- |
* | "Colour scale: from the lowest to the highest value in the column" |
*
* @param {Chart_Heatmap_ScaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_heatmap_scale = /** @type {((inputs?: Chart_Heatmap_ScaleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Heatmap_ScaleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_heatmap_scale(inputs)
	if (locale === "en") return en_chart_heatmap_scale(inputs)
	return ru_chart_heatmap_scale(inputs)
});