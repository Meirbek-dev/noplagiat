/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_HintInputs */

const ru_login_hint = /** @type {(inputs: Login_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Войдите под учётной записью, которую создал администратор системы.`)
};

const kk_login_hint = /** @type {(inputs: Login_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүйе әкімшісі жасаған тіркелгімен кіріңіз.`)
};

const en_login_hint = /** @type {(inputs: Login_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in with the account your system administrator created.`)
};

/**
* | output |
* | --- |
* | "Sign in with the account your system administrator created." |
*
* @param {Login_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_hint = /** @type {((inputs?: Login_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_hint(inputs)
	if (locale === "en") return en_login_hint(inputs)
	return ru_login_hint(inputs)
});