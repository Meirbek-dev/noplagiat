/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Scope_FacultyInputs */

const ru_scope_faculty = /** @type {(inputs: Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`В пределах факультета`)
};

const kk_scope_faculty = /** @type {(inputs: Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет шегінде`)
};

const en_scope_faculty = /** @type {(inputs: Scope_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Within the faculty`)
};

/**
* | output |
* | --- |
* | "Within the faculty" |
*
* @param {Scope_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_faculty = /** @type {((inputs?: Scope_FacultyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Scope_FacultyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_scope_faculty(inputs)
	if (locale === "en") return en_scope_faculty(inputs)
	return ru_scope_faculty(inputs)
});