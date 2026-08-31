/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Spring_StartInputs */

const ru_setting_spring_start = /** @type {(inputs: Setting_Spring_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Начало весеннего семестра`)
};

const kk_setting_spring_start = /** @type {(inputs: Setting_Spring_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Көктемгі семестрдің басы`)
};

const en_setting_spring_start = /** @type {(inputs: Setting_Spring_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Spring semester start`)
};

/**
* | output |
* | --- |
* | "Spring semester start" |
*
* @param {Setting_Spring_StartInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_spring_start = /** @type {((inputs?: Setting_Spring_StartInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Spring_StartInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_spring_start(inputs)
	if (locale === "en") return en_setting_spring_start(inputs)
	return ru_setting_spring_start(inputs)
});