/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_Scope_FacultyInputs */

const ru_roles_scope_faculty = /** @type {(inputs: Roles_Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Область: факультет`)
};

const kk_roles_scope_faculty = /** @type {(inputs: Roles_Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аймақ: факультет`)
};

const en_roles_scope_faculty = /** @type {(inputs: Roles_Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scope: faculty`)
};

/**
* | output |
* | --- |
* | "Scope: faculty" |
*
* @param {Roles_Scope_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_scope_faculty = /** @type {((inputs?: Roles_Scope_FacultyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Scope_FacultyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_scope_faculty(inputs)
	if (locale === "en") return en_roles_scope_faculty(inputs)
	return ru_roles_scope_faculty(inputs)
});