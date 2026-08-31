/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_Scope_DepartmentInputs */

const ru_login_scope_department = /** @type {(inputs: Login_Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Код кафедры`)
};

const kk_login_scope_department = /** @type {(inputs: Login_Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра коды`)
};

const en_login_scope_department = /** @type {(inputs: Login_Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Department code`)
};

/**
* | output |
* | --- |
* | "Department code" |
*
* @param {Login_Scope_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_scope_department = /** @type {((inputs?: Login_Scope_DepartmentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_Scope_DepartmentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_scope_department(inputs)
	if (locale === "en") return en_login_scope_department(inputs)
	return ru_login_scope_department(inputs)
});