/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Usage_Avg_DurationInputs */

const ru_usage_avg_duration = /** @type {(inputs: Usage_Avg_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Среднее время выполнения проверки`)
};

const kk_usage_avg_duration = /** @type {(inputs: Usage_Avg_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерудің орташа уақыты`)
};

const en_usage_avg_duration = /** @type {(inputs: Usage_Avg_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average check duration`)
};

/**
* | output |
* | --- |
* | "Average check duration" |
*
* @param {Usage_Avg_DurationInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_avg_duration = /** @type {((inputs?: Usage_Avg_DurationInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Usage_Avg_DurationInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_usage_avg_duration(inputs)
	if (locale === "en") return en_usage_avg_duration(inputs)
	return ru_usage_avg_duration(inputs)
});