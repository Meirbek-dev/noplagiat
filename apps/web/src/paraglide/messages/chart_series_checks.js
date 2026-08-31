/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Series_ChecksInputs */

const ru_chart_series_checks = /** @type {(inputs: Chart_Series_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверки`)
};

const kk_chart_series_checks = /** @type {(inputs: Chart_Series_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерулер`)
};

const en_chart_series_checks = /** @type {(inputs: Chart_Series_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks`)
};

/**
* | output |
* | --- |
* | "Checks" |
*
* @param {Chart_Series_ChecksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_checks = /** @type {((inputs?: Chart_Series_ChecksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Series_ChecksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_series_checks(inputs)
	if (locale === "en") return en_chart_series_checks(inputs)
	return ru_chart_series_checks(inputs)
});