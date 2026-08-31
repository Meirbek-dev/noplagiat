/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Histogram_TitleInputs */

const ru_chart_histogram_title = /** @type {(inputs: Chart_Histogram_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверки по диапазонам оригинальности`)
};

const kk_chart_histogram_title = /** @type {(inputs: Chart_Histogram_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірегейлік ауқымдары бойынша тексерулер`)
};

const en_chart_histogram_title = /** @type {(inputs: Chart_Histogram_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks by originality band`)
};

/**
* | output |
* | --- |
* | "Checks by originality band" |
*
* @param {Chart_Histogram_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_histogram_title = /** @type {((inputs?: Chart_Histogram_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Histogram_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_histogram_title(inputs)
	if (locale === "en") return en_chart_histogram_title(inputs)
	return ru_chart_histogram_title(inputs)
});