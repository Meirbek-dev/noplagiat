/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_GrantInputs */

const ru_roles_grant = /** @type {(inputs: Roles_GrantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выдать роль`)
};

const kk_roles_grant = /** @type {(inputs: Roles_GrantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл беру`)
};

const en_roles_grant = /** @type {(inputs: Roles_GrantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Grant a role`)
};

/**
* | output |
* | --- |
* | "Grant a role" |
*
* @param {Roles_GrantInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant = /** @type {((inputs?: Roles_GrantInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_GrantInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_grant(inputs)
	if (locale === "en") return en_roles_grant(inputs)
	return ru_roles_grant(inputs)
});