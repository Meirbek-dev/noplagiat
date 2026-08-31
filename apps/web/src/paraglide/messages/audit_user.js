/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_UserInputs */

const ru_audit_user = /** @type {(inputs: Audit_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пользователь`)
};

const kk_audit_user = /** @type {(inputs: Audit_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пайдаланушы`)
};

const en_audit_user = /** @type {(inputs: Audit_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`User`)
};

/**
* | output |
* | --- |
* | "User" |
*
* @param {Audit_UserInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_user = /** @type {((inputs?: Audit_UserInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_UserInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_user(inputs)
	if (locale === "en") return en_audit_user(inputs)
	return ru_audit_user(inputs)
});