/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_Scope_FacultyInputs */

const ru_login_scope_faculty = /** @type {(inputs: Login_Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Код факультета`)
};

const kk_login_scope_faculty = /** @type {(inputs: Login_Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет коды`)
};

const en_login_scope_faculty = /** @type {(inputs: Login_Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faculty code`)
};

/**
* | output |
* | --- |
* | "Faculty code" |
*
* @param {Login_Scope_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_scope_faculty = /** @type {((inputs?: Login_Scope_FacultyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_Scope_FacultyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_scope_faculty(inputs)
	if (locale === "en") return en_login_scope_faculty(inputs)
	return ru_login_scope_faculty(inputs)
});