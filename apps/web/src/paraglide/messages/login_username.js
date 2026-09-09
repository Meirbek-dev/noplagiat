/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_UsernameInputs */

const ru_login_username = /** @type {(inputs: Login_UsernameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Логин`)
};

const kk_login_username = /** @type {(inputs: Login_UsernameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Логин`)
};

const en_login_username = /** @type {(inputs: Login_UsernameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Login name`)
};

/**
* | output |
* | --- |
* | "Login name" |
*
* @param {Login_UsernameInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_username = /** @type {((inputs?: Login_UsernameInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_UsernameInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_username(inputs)
	if (locale === "en") return en_login_username(inputs)
	return ru_login_username(inputs)
});