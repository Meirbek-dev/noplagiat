/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Staff_Unit_UpdatedInputs */

const ru_staff_unit_updated = /** @type {(inputs: Staff_Unit_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Обновлено`)
};

const kk_staff_unit_updated = /** @type {(inputs: Staff_Unit_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жаңартылды`)
};

const en_staff_unit_updated = /** @type {(inputs: Staff_Unit_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Updated`)
};

/**
* | output |
* | --- |
* | "Updated" |
*
* @param {Staff_Unit_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_updated = /** @type {((inputs?: Staff_Unit_UpdatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_UpdatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_staff_unit_updated(inputs)
	if (locale === "en") return en_staff_unit_updated(inputs)
	return ru_staff_unit_updated(inputs)
});