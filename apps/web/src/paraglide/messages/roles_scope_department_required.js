/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_Scope_Department_RequiredInputs */

const ru_roles_scope_department_required = /** @type {(inputs: Roles_Scope_Department_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Обязательно для заведующего кафедрой`)
};

const kk_roles_scope_department_required = /** @type {(inputs: Roles_Scope_Department_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра меңгерушісі үшін міндетті`)
};

const en_roles_scope_department_required = /** @type {(inputs: Roles_Scope_Department_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Required for a head of department`)
};

/**
* | output |
* | --- |
* | "Required for a head of department" |
*
* @param {Roles_Scope_Department_RequiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_department_required = /** @type {((inputs?: Roles_Scope_Department_RequiredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_Department_RequiredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_scope_department_required(inputs)
	if (locale === "en") return en_roles_scope_department_required(inputs)
	return ru_roles_scope_department_required(inputs)
});