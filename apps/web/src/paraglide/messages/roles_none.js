/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_NoneInputs */

const ru_roles_none = /** @type {(inputs: Roles_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Учётных записей нет.`)
};

const kk_roles_none = /** @type {(inputs: Roles_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркелгілер жоқ.`)
};

const en_roles_none = /** @type {(inputs: Roles_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No accounts.`)
};

/**
* | output |
* | --- |
* | "No accounts." |
*
* @param {Roles_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_none = /** @type {((inputs?: Roles_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_none(inputs)
	if (locale === "en") return en_roles_none(inputs)
	return ru_roles_none(inputs)
});