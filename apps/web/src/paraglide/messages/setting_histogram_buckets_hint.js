/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Histogram_Buckets_HintInputs */

const ru_setting_histogram_buckets_hint = /** @type {(inputs: Setting_Histogram_Buckets_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проценты через запятую по возрастанию, например 50, 70, 85, 95.`)
};

const kk_setting_histogram_buckets_hint = /** @type {(inputs: Setting_Histogram_Buckets_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пайыздар үтір арқылы өсу ретімен, мысалы 50, 70, 85, 95.`)
};

const en_setting_histogram_buckets_hint = /** @type {(inputs: Setting_Histogram_Buckets_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Percentages, comma separated and ascending, e.g. 50, 70, 85, 95.`)
};

/**
* | output |
* | --- |
* | "Percentages, comma separated and ascending, e.g. 50, 70, 85, 95." |
*
* @param {Setting_Histogram_Buckets_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets_hint = /** @type {((inputs?: Setting_Histogram_Buckets_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Histogram_Buckets_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_histogram_buckets_hint(inputs)
	if (locale === "en") return en_setting_histogram_buckets_hint(inputs)
	return ru_setting_histogram_buckets_hint(inputs)
});