/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Staff_Unit_MaskedInputs */

const ru_staff_unit_masked = /** @type {(inputs: Staff_Unit_MaskedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Маска адреса`)
};

const kk_staff_unit_masked = /** @type {(inputs: Staff_Unit_MaskedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мекенжай маскасы`)
};

const en_staff_unit_masked = /** @type {(inputs: Staff_Unit_MaskedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Masked address`)
};

/**
* | output |
* | --- |
* | "Masked address" |
*
* @param {Staff_Unit_MaskedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_masked = /** @type {((inputs?: Staff_Unit_MaskedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_MaskedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_staff_unit_masked(inputs)
	if (locale === "en") return en_staff_unit_masked(inputs)
	return ru_staff_unit_masked(inputs)
});