/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Originality_ThresholdInputs */

const ru_setting_originality_threshold = /** @type {(inputs: Setting_Originality_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Порог оригинальности, %`)
};

const kk_setting_originality_threshold = /** @type {(inputs: Setting_Originality_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Түпнұсқалық шегі, %`)
};

const en_setting_originality_threshold = /** @type {(inputs: Setting_Originality_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality threshold, %`)
};

/**
* | output |
* | --- |
* | "Originality threshold, %" |
*
* @param {Setting_Originality_ThresholdInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_originality_threshold = /** @type {((inputs?: Setting_Originality_ThresholdInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Originality_ThresholdInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_originality_threshold(inputs)
	if (locale === "en") return en_setting_originality_threshold(inputs)
	return ru_setting_originality_threshold(inputs)
});