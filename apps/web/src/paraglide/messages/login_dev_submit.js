/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_Dev_SubmitInputs */

const ru_login_dev_submit = /** @type {(inputs: Login_Dev_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Войти в режиме разработки`)
};

const kk_login_dev_submit = /** @type {(inputs: Login_Dev_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әзірлеу режимінде кіру`)
};

const en_login_dev_submit = /** @type {(inputs: Login_Dev_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in (development)`)
};

/**
* | output |
* | --- |
* | "Sign in (development)" |
*
* @param {Login_Dev_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_dev_submit = /** @type {((inputs?: Login_Dev_SubmitInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_Dev_SubmitInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_dev_submit(inputs)
	if (locale === "en") return en_login_dev_submit(inputs)
	return ru_login_dev_submit(inputs)
});