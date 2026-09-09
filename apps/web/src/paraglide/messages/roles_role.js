/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_RoleInputs */

const ru_roles_role = /** @type {(inputs: Roles_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Роль`)
};

const kk_roles_role = /** @type {(inputs: Roles_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл`)
};

const en_roles_role = /** @type {(inputs: Roles_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Role`)
};

/**
* | output |
* | --- |
* | "Role" |
*
* @param {Roles_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_role = /** @type {((inputs?: Roles_RoleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_RoleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_role(inputs)
	if (locale === "en") return en_roles_role(inputs)
	return ru_roles_role(inputs)
});