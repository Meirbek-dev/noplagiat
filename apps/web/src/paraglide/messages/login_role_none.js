/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_Role_NoneInputs */

const ru_login_role_none = /** @type {(inputs: Login_Role_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Без роли`)
};

const kk_login_role_none = /** @type {(inputs: Login_Role_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөлсіз`)
};

const en_login_role_none = /** @type {(inputs: Login_Role_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No role`)
};

/**
* | output |
* | --- |
* | "No role" |
*
* @param {Login_Role_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_role_none = /** @type {((inputs?: Login_Role_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_Role_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_role_none(inputs)
	if (locale === "en") return en_login_role_none(inputs)
	return ru_login_role_none(inputs)
});