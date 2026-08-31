/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_K_ThresholdInputs */

const ru_setting_k_threshold = /** @type {(inputs: Setting_K_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Порог k-анонимности`)
};

const kk_setting_k_threshold = /** @type {(inputs: Setting_K_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`k-анонимдік шегі`)
};

const en_setting_k_threshold = /** @type {(inputs: Setting_K_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`k-anonymity threshold`)
};

/**
* | output |
* | --- |
* | "k-anonymity threshold" |
*
* @param {Setting_K_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_k_threshold = /** @type {((inputs?: Setting_K_ThresholdInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_K_ThresholdInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_k_threshold(inputs)
	if (locale === "en") return en_setting_k_threshold(inputs)
	return ru_setting_k_threshold(inputs)
});