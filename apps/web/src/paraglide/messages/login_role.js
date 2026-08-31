/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_RoleInputs */

const ru_login_role = /** @type {(inputs: Login_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Роль`)
};

const kk_login_role = /** @type {(inputs: Login_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл`)
};

const en_login_role = /** @type {(inputs: Login_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Role`)
};

/**
* | output |
* | --- |
* | "Role" |
*
* @param {Login_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_role = /** @type {((inputs?: Login_RoleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_RoleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_role(inputs)
	if (locale === "en") return en_login_role(inputs)
	return ru_login_role(inputs)
});