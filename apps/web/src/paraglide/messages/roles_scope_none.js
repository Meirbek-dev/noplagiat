/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_Scope_NoneInputs */

const ru_roles_scope_none = /** @type {(inputs: Roles_Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Без ограничения`)
};

const kk_roles_scope_none = /** @type {(inputs: Roles_Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шектеусіз`)
};

const en_roles_scope_none = /** @type {(inputs: Roles_Scope_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unrestricted`)
};

/**
* | output |
* | --- |
* | "Unrestricted" |
*
* @param {Roles_Scope_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_none = /** @type {((inputs?: Roles_Scope_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_scope_none(inputs)
	if (locale === "en") return en_roles_scope_none(inputs)
	return ru_roles_scope_none(inputs)
});