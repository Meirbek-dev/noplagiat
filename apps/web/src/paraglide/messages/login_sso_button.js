/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_Sso_ButtonInputs */

const ru_login_sso_button = /** @type {(inputs: Login_Sso_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Войти через единый вход`)
};

const kk_login_sso_button = /** @type {(inputs: Login_Sso_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірыңғай кіру арқылы кіру`)
};

const en_login_sso_button = /** @type {(inputs: Login_Sso_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in with SSO`)
};

/**
* | output |
* | --- |
* | "Sign in with SSO" |
*
* @param {Login_Sso_ButtonInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_sso_button = /** @type {((inputs?: Login_Sso_ButtonInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_Sso_ButtonInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_sso_button(inputs)
	if (locale === "en") return en_login_sso_button(inputs)
	return ru_login_sso_button(inputs)
});