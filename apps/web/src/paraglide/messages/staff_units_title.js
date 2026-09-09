/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Staff_Units_TitleInputs */

const ru_staff_units_title = /** @type {(inputs: Staff_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверяющие и подразделения`)
};

const kk_staff_units_title = /** @type {(inputs: Staff_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушілер мен бөлімшелер`)
};

const en_staff_units_title = /** @type {(inputs: Staff_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reviewers and units`)
};

/**
* | output |
* | --- |
* | "Reviewers and units" |
*
* @param {Staff_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_units_title = /** @type {((inputs?: Staff_Units_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Units_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_staff_units_title(inputs)
	if (locale === "en") return en_staff_units_title(inputs)
	return ru_staff_units_title(inputs)
});