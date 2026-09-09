/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Autumn_StartInputs */

const ru_setting_autumn_start = /** @type {(inputs: Setting_Autumn_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Начало осеннего семестра`)
};

const kk_setting_autumn_start = /** @type {(inputs: Setting_Autumn_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Күзгі семестрдің басы`)
};

const en_setting_autumn_start = /** @type {(inputs: Setting_Autumn_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autumn semester start`)
};

/**
* | output |
* | --- |
* | "Autumn semester start" |
*
* @param {Setting_Autumn_StartInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_autumn_start = /** @type {((inputs?: Setting_Autumn_StartInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Autumn_StartInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_autumn_start(inputs)
	if (locale === "en") return en_setting_autumn_start(inputs)
	return ru_setting_autumn_start(inputs)
});