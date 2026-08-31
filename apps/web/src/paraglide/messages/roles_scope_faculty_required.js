/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_Scope_Faculty_RequiredInputs */

const ru_roles_scope_faculty_required = /** @type {(inputs: Roles_Scope_Faculty_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Обязательно для декана`)
};

const kk_roles_scope_faculty_required = /** @type {(inputs: Roles_Scope_Faculty_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Декан үшін міндетті`)
};

const en_roles_scope_faculty_required = /** @type {(inputs: Roles_Scope_Faculty_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Required for a dean`)
};

/**
* | output |
* | --- |
* | "Required for a dean" |
*
* @param {Roles_Scope_Faculty_RequiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_faculty_required = /** @type {((inputs?: Roles_Scope_Faculty_RequiredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_Faculty_RequiredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_scope_faculty_required(inputs)
	if (locale === "en") return en_roles_scope_faculty_required(inputs)
	return ru_roles_scope_faculty_required(inputs)
});