/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_SubmitInputs */

const ru_login_submit = /** @type {(inputs: Login_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Войти`)
};

const kk_login_submit = /** @type {(inputs: Login_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кіру`)
};

const en_login_submit = /** @type {(inputs: Login_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in`)
};

/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Login_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_submit = /** @type {((inputs?: Login_SubmitInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_SubmitInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_submit(inputs)
	if (locale === "en") return en_login_submit(inputs)
	return ru_login_submit(inputs)
});