/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Staff_Unit_NoneInputs */

const ru_staff_unit_none = /** @type {(inputs: Staff_Unit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сопоставления не заданы.`)
};

const kk_staff_unit_none = /** @type {(inputs: Staff_Unit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сәйкестіктер белгіленбеген.`)
};

const en_staff_unit_none = /** @type {(inputs: Staff_Unit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No mappings defined.`)
};

/**
* | output |
* | --- |
* | "No mappings defined." |
*
* @param {Staff_Unit_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_none = /** @type {((inputs?: Staff_Unit_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_staff_unit_none(inputs)
	if (locale === "en") return en_staff_unit_none(inputs)
	return ru_staff_unit_none(inputs)
});