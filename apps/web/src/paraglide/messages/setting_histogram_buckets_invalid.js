/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Histogram_Buckets_InvalidInputs */

const ru_setting_histogram_buckets_invalid = /** @type {(inputs: Setting_Histogram_Buckets_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Границы должны идти по возрастанию в диапазоне от 0 до 100`)
};

const kk_setting_histogram_buckets_invalid = /** @type {(inputs: Setting_Histogram_Buckets_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шекаралар 0-ден 100-ге дейінгі ауқымда өсу ретімен болуы тиіс`)
};

const en_setting_histogram_buckets_invalid = /** @type {(inputs: Setting_Histogram_Buckets_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edges must ascend and stay between 0 and 100`)
};

/**
* | output |
* | --- |
* | "Edges must ascend and stay between 0 and 100" |
*
* @param {Setting_Histogram_Buckets_InvalidInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_histogram_buckets_invalid = /** @type {((inputs?: Setting_Histogram_Buckets_InvalidInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Histogram_Buckets_InvalidInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_histogram_buckets_invalid(inputs)
	if (locale === "en") return en_setting_histogram_buckets_invalid(inputs)
	return ru_setting_histogram_buckets_invalid(inputs)
});