/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_FailedInputs */

const ru_login_failed = /** @type {(inputs: Login_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Неверный логин или пароль.`)
};

const kk_login_failed = /** @type {(inputs: Login_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Логин немесе құпия сөз қате.`)
};

const en_login_failed = /** @type {(inputs: Login_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The login name or password is not correct.`)
};

/**
* | output |
* | --- |
* | "The login name or password is not correct." |
*
* @param {Login_FailedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_failed = /** @type {((inputs?: Login_FailedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_FailedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_failed(inputs)
	if (locale === "en") return en_login_failed(inputs)
	return ru_login_failed(inputs)
});