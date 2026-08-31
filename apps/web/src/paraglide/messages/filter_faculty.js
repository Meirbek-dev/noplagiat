/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_FacultyInputs */

const ru_filter_faculty = /** @type {(inputs: Filter_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет`)
};

const kk_filter_faculty = /** @type {(inputs: Filter_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет`)
};

const en_filter_faculty = /** @type {(inputs: Filter_FacultyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faculty`)
};

/**
* | output |
* | --- |
* | "Faculty" |
*
* @param {Filter_FacultyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_faculty = /** @type {((inputs?: Filter_FacultyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_FacultyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_faculty(inputs)
	if (locale === "en") return en_filter_faculty(inputs)
	return ru_filter_faculty(inputs)
});