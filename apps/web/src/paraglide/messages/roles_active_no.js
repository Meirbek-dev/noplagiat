/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_Active_NoInputs */

const ru_roles_active_no = /** @type {(inputs: Roles_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отключена`)
};

const kk_roles_active_no = /** @type {(inputs: Roles_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өшірілген`)
};

const en_roles_active_no = /** @type {(inputs: Roles_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disabled`)
};

/**
* | output |
* | --- |
* | "Disabled" |
*
* @param {Roles_Active_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_active_no = /** @type {((inputs?: Roles_Active_NoInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Active_NoInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_active_no(inputs)
	if (locale === "en") return en_roles_active_no(inputs)
	return ru_roles_active_no(inputs)
});