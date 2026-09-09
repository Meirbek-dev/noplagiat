/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_ThrottledInputs */

const ru_login_throttled = /** @type {(inputs: Login_ThrottledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Слишком много попыток входа. Подождите и попробуйте снова.`)
};

const kk_login_throttled = /** @type {(inputs: Login_ThrottledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кіру әрекеті тым көп. Сәл күтіп, қайта көріңіз.`)
};

const en_login_throttled = /** @type {(inputs: Login_ThrottledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Too many sign-in attempts. Wait a moment and try again.`)
};

/**
* | output |
* | --- |
* | "Too many sign-in attempts. Wait a moment and try again." |
*
* @param {Login_ThrottledInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_throttled = /** @type {((inputs?: Login_ThrottledInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_ThrottledInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_throttled(inputs)
	if (locale === "en") return en_login_throttled(inputs)
	return ru_login_throttled(inputs)
});