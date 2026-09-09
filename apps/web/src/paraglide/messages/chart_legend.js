/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_LegendInputs */

const ru_chart_legend = /** @type {(inputs: Chart_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Легенда`)
};

const kk_chart_legend = /** @type {(inputs: Chart_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шартты белгілер`)
};

const en_chart_legend = /** @type {(inputs: Chart_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Legend`)
};

/**
* | output |
* | --- |
* | "Legend" |
*
* @param {Chart_LegendInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_legend = /** @type {((inputs?: Chart_LegendInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_LegendInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_legend(inputs)
	if (locale === "en") return en_chart_legend(inputs)
	return ru_chart_legend(inputs)
});