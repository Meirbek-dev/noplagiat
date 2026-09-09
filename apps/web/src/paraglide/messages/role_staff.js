/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Role_StaffInputs */

const ru_role_staff = /** @type {(inputs: Role_StaffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ППС`)
};

const kk_role_staff = /** @type {(inputs: Role_StaffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ПОҚ`)
};

const en_role_staff = /** @type {(inputs: Role_StaffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Teaching staff`)
};

/**
* | output |
* | --- |
* | "Teaching staff" |
*
* @param {Role_StaffInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_staff = /** @type {((inputs?: Role_StaffInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_StaffInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_role_staff(inputs)
	if (locale === "en") return en_role_staff(inputs)
	return ru_role_staff(inputs)
});