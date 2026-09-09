/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_FacultiesInputs */

const ru_section_faculties = /** @type {(inputs: Section_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`По факультетам`)
};

const kk_section_faculties = /** @type {(inputs: Section_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер бойынша`)
};

const en_section_faculties = /** @type {(inputs: Section_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By faculty`)
};

/**
* | output |
* | --- |
* | "By faculty" |
*
* @param {Section_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_faculties = /** @type {((inputs?: Section_FacultiesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_FacultiesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_faculties(inputs)
	if (locale === "en") return en_section_faculties(inputs)
	return ru_section_faculties(inputs)
});