/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_ShareInputs */

const ru_chart_axis_share = /** @type {(inputs: Chart_Axis_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Доля от общего, %`)
};

const kk_chart_axis_share = /** @type {(inputs: Chart_Axis_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жалпы саннан үлесі, %`)
};

const en_chart_axis_share = /** @type {(inputs: Chart_Axis_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Share of total, %`)
};

/**
* | output |
* | --- |
* | "Share of total, %" |
*
* @param {Chart_Axis_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_share = /** @type {((inputs?: Chart_Axis_ShareInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_ShareInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_share(inputs)
	if (locale === "en") return en_chart_axis_share(inputs)
	return ru_chart_axis_share(inputs)
});