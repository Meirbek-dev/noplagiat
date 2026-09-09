/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Internal_Nav_SectionsInputs */

const ru_internal_nav_sections = /** @type {(inputs: Internal_Nav_SectionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разделы`)
};

const kk_internal_nav_sections = /** @type {(inputs: Internal_Nav_SectionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімдер`)
};

const en_internal_nav_sections = /** @type {(inputs: Internal_Nav_SectionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sections`)
};

/**
* | output |
* | --- |
* | "Sections" |
*
* @param {Internal_Nav_SectionsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_sections = /** @type {((inputs?: Internal_Nav_SectionsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Nav_SectionsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_internal_nav_sections(inputs)
	if (locale === "en") return en_internal_nav_sections(inputs)
	return ru_internal_nav_sections(inputs)
});