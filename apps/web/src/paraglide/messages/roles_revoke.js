/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_RevokeInputs */

const ru_roles_revoke = /** @type {(inputs: Roles_RevokeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отозвать роль`)
};

const kk_roles_revoke = /** @type {(inputs: Roles_RevokeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөлді қайтарып алу`)
};

const en_roles_revoke = /** @type {(inputs: Roles_RevokeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revoke the role`)
};

/**
* | output |
* | --- |
* | "Revoke the role" |
*
* @param {Roles_RevokeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_revoke = /** @type {((inputs?: Roles_RevokeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_RevokeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_revoke(inputs)
	if (locale === "en") return en_roles_revoke(inputs)
	return ru_roles_revoke(inputs)
});