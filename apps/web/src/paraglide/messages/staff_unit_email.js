/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Staff_Unit_EmailInputs */

const ru_staff_unit_email = /** @type {(inputs: Staff_Unit_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Электронная почта проверяющего`)
};

const kk_staff_unit_email = /** @type {(inputs: Staff_Unit_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушінің электрондық поштасы`)
};

const en_staff_unit_email = /** @type {(inputs: Staff_Unit_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reviewer e-mail`)
};

/**
* | output |
* | --- |
* | "Reviewer e-mail" |
*
* @param {Staff_Unit_EmailInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_email = /** @type {((inputs?: Staff_Unit_EmailInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_EmailInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_staff_unit_email(inputs)
	if (locale === "en") return en_staff_unit_email(inputs)
	return ru_staff_unit_email(inputs)
});