/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Scope_DepartmentInputs */

const ru_scope_department = /** @type {(inputs: Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`В пределах кафедры`)
};

const kk_scope_department = /** @type {(inputs: Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра шегінде`)
};

const en_scope_department = /** @type {(inputs: Scope_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Within the department`)
};

/**
* | output |
* | --- |
* | "Within the department" |
*
* @param {Scope_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_department = /** @type {((inputs?: Scope_DepartmentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Scope_DepartmentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_scope_department(inputs)
	if (locale === "en") return en_scope_department(inputs)
	return ru_scope_department(inputs)
});