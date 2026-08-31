/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_AccountInputs */

const ru_roles_account = /** @type {(inputs: Roles_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Учётная запись`)
};

const kk_roles_account = /** @type {(inputs: Roles_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркелгі`)
};

const en_roles_account = /** @type {(inputs: Roles_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account`)
};

/**
* | output |
* | --- |
* | "Account" |
*
* @param {Roles_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_account = /** @type {((inputs?: Roles_AccountInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_AccountInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_account(inputs)
	if (locale === "en") return en_roles_account(inputs)
	return ru_roles_account(inputs)
});