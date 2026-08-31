/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Semester_HintInputs */

const ru_setting_semester_hint = /** @type {(inputs: Setting_Semester_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Формат ММ-ДД.`)
};

const kk_setting_semester_hint = /** @type {(inputs: Setting_Semester_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пішімі АА-КК.`)
};

const en_setting_semester_hint = /** @type {(inputs: Setting_Semester_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Format MM-DD.`)
};

/**
* | output |
* | --- |
* | "Format MM-DD." |
*
* @param {Setting_Semester_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_semester_hint = /** @type {((inputs?: Setting_Semester_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Semester_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_semester_hint(inputs)
	if (locale === "en") return en_setting_semester_hint(inputs)
	return ru_setting_semester_hint(inputs)
});