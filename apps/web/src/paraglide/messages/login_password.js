/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_PasswordInputs */

const ru_login_password = /** @type {(inputs: Login_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пароль`)
};

const kk_login_password = /** @type {(inputs: Login_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Құпия сөз`)
};

const en_login_password = /** @type {(inputs: Login_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password`)
};

/**
* | output |
* | --- |
* | "Password" |
*
* @param {Login_PasswordInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_password = /** @type {((inputs?: Login_PasswordInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_PasswordInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_password(inputs)
	if (locale === "en") return en_login_password(inputs)
	return ru_login_password(inputs)
});