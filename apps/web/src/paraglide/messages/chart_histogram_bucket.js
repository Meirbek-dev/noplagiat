/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Histogram_BucketInputs */

const ru_chart_histogram_bucket = /** @type {(inputs: Chart_Histogram_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Диапазон оригинальности`)
};

const kk_chart_histogram_bucket = /** @type {(inputs: Chart_Histogram_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірегейлік ауқымы`)
};

const en_chart_histogram_bucket = /** @type {(inputs: Chart_Histogram_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality range`)
};

/**
* | output |
* | --- |
* | "Originality range" |
*
* @param {Chart_Histogram_BucketInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_histogram_bucket = /** @type {((inputs?: Chart_Histogram_BucketInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Histogram_BucketInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_histogram_bucket(inputs)
	if (locale === "en") return en_chart_histogram_bucket(inputs)
	return ru_chart_histogram_bucket(inputs)
});