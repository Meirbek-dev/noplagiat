/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Role_NoneInputs */

const ru_role_none = /** @type {(inputs: Role_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Роль не назначена`)
};

const kk_role_none = /** @type {(inputs: Role_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл берілмеген`)
};

const en_role_none = /** @type {(inputs: Role_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No role`)
};

/**
* | output |
* | --- |
* | "No role" |
*
* @param {Role_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_none = /** @type {((inputs?: Role_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_role_none(inputs)
	if (locale === "en") return en_role_none(inputs)
	return ru_role_none(inputs)
});