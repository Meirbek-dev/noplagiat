/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_SubjectInputs */

const ru_login_subject = /** @type {(inputs: Login_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Идентификатор пользователя`)
};

const kk_login_subject = /** @type {(inputs: Login_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пайдаланушы идентификаторы`)
};

const en_login_subject = /** @type {(inputs: Login_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`User identifier`)
};

/**
* | output |
* | --- |
* | "User identifier" |
*
* @param {Login_SubjectInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_subject = /** @type {((inputs?: Login_SubjectInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_SubjectInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_subject(inputs)
	if (locale === "en") return en_login_subject(inputs)
	return ru_login_subject(inputs)
});