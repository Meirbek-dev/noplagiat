/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Role_AdminInputs */

const ru_role_admin = /** @type {(inputs: Role_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Администратор`)
};

const kk_role_admin = /** @type {(inputs: Role_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әкімші`)
};

const en_role_admin = /** @type {(inputs: Role_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Administrator`)
};

/**
* | output |
* | --- |
* | "Administrator" |
*
* @param {Role_AdminInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_admin = /** @type {((inputs?: Role_AdminInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_AdminInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_role_admin(inputs)
	if (locale === "en") return en_role_admin(inputs)
	return ru_role_admin(inputs)
});