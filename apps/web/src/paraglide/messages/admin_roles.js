/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_RolesInputs */

const ru_admin_roles = /** @type {(inputs: Admin_RolesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Роли и доступ`)
};

const kk_admin_roles = /** @type {(inputs: Admin_RolesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөлдер мен қолжетімділік`)
};

const en_admin_roles = /** @type {(inputs: Admin_RolesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Roles and access`)
};

/**
* | output |
* | --- |
* | "Roles and access" |
*
* @param {Admin_RolesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_roles = /** @type {((inputs?: Admin_RolesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_RolesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_roles(inputs)
	if (locale === "en") return en_admin_roles(inputs)
	return ru_admin_roles(inputs)
});