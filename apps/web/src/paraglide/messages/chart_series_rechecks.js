/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Series_RechecksInputs */

const ru_chart_series_rechecks = /** @type {(inputs: Chart_Series_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Повторные проверки`)
};

const kk_chart_series_rechecks = /** @type {(inputs: Chart_Series_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексерулер`)
};

const en_chart_series_rechecks = /** @type {(inputs: Chart_Series_RechecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechecks`)
};

/**
* | output |
* | --- |
* | "Rechecks" |
*
* @param {Chart_Series_RechecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_rechecks = /** @type {((inputs?: Chart_Series_RechecksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Series_RechecksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_series_rechecks(inputs)
	if (locale === "en") return en_chart_series_rechecks(inputs)
	return ru_chart_series_rechecks(inputs)
});