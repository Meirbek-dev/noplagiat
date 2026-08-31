/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_Scope_DepartmentInputs */

const ru_roles_scope_department = /** @type {(inputs: Roles_Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Область: кафедра`)
};

const kk_roles_scope_department = /** @type {(inputs: Roles_Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аймақ: кафедра`)
};

const en_roles_scope_department = /** @type {(inputs: Roles_Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scope: department`)
};

/**
* | output |
* | --- |
* | "Scope: department" |
*
* @param {Roles_Scope_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_department = /** @type {((inputs?: Roles_Scope_DepartmentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_DepartmentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_scope_department(inputs)
	if (locale === "en") return en_roles_scope_department(inputs)
	return ru_roles_scope_department(inputs)
});