/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_GrantsInputs */

const ru_roles_grants = /** @type {(inputs: Roles_GrantsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выданные роли`)
};

const kk_roles_grants = /** @type {(inputs: Roles_GrantsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Берілген рөлдер`)
};

const en_roles_grants = /** @type {(inputs: Roles_GrantsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Grants`)
};

/**
* | output |
* | --- |
* | "Grants" |
*
* @param {Roles_GrantsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grants = /** @type {((inputs?: Roles_GrantsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_GrantsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_grants(inputs)
	if (locale === "en") return en_roles_grants(inputs)
	return ru_roles_grants(inputs)
});