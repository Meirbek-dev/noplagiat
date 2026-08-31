/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Originality_Threshold_HintInputs */

const ru_setting_originality_threshold_hint = /** @type {(inputs: Setting_Originality_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Работы ниже порога считаются требующими внимания. По умолчанию - 70.`)
};

const kk_setting_originality_threshold_hint = /** @type {(inputs: Setting_Originality_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шектен төмен жұмыстар назар аударуды талап етеді деп саналады. Әдепкі мән - 70.`)
};

const en_setting_originality_threshold_hint = /** @type {(inputs: Setting_Originality_Threshold_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Works below the threshold count as needing attention. The default is 70.`)
};

/**
* | output |
* | --- |
* | "Works below the threshold count as needing attention. The default is 70." |
*
* @param {Setting_Originality_Threshold_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_originality_threshold_hint = /** @type {((inputs?: Setting_Originality_Threshold_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Originality_Threshold_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_originality_threshold_hint(inputs)
	if (locale === "en") return en_setting_originality_threshold_hint(inputs)
	return ru_setting_originality_threshold_hint(inputs)
});