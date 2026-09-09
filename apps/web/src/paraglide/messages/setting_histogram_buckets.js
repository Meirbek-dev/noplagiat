/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Histogram_BucketsInputs */

const ru_setting_histogram_buckets = /** @type {(inputs: Setting_Histogram_BucketsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Границы диапазонов оригинальности`)
};

const kk_setting_histogram_buckets = /** @type {(inputs: Setting_Histogram_BucketsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Түпнұсқалық ауқымдарының шекаралары`)
};

const en_setting_histogram_buckets = /** @type {(inputs: Setting_Histogram_BucketsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality band edges`)
};

/**
* | output |
* | --- |
* | "Originality band edges" |
*
* @param {Setting_Histogram_BucketsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets = /** @type {((inputs?: Setting_Histogram_BucketsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Histogram_BucketsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_histogram_buckets(inputs)
	if (locale === "en") return en_setting_histogram_buckets(inputs)
	return ru_setting_histogram_buckets(inputs)
});