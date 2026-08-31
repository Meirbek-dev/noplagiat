/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_K_Threshold_HintInputs */

const ru_setting_k_threshold_hint = /** @type {(inputs: Setting_K_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Группы меньше k наблюдений не публикуются. Рекомендуемое значение - 5.`)
};

const kk_setting_k_threshold_hint = /** @type {(inputs: Setting_K_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`k-дан аз бақылауы бар топтар жарияланбайды. Ұсынылатын мән - 5.`)
};

const en_setting_k_threshold_hint = /** @type {(inputs: Setting_K_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Groups smaller than k are not published. The recommended value is 5.`)
};

/**
* | output |
* | --- |
* | "Groups smaller than k are not published. The recommended value is 5." |
*
* @param {Setting_K_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_k_threshold_hint = /** @type {((inputs?: Setting_K_Threshold_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_K_Threshold_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_k_threshold_hint(inputs)
	if (locale === "en") return en_setting_k_threshold_hint(inputs)
	return ru_setting_k_threshold_hint(inputs)
});