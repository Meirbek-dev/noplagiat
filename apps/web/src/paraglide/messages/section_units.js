/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_UnitsInputs */

const ru_section_units = /** @type {(inputs: Section_UnitsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`По факультетам и кафедрам`)
};

const kk_section_units = /** @type {(inputs: Section_UnitsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер мен кафедралар бойынша`)
};

const en_section_units = /** @type {(inputs: Section_UnitsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By faculty and department`)
};

/**
* | output |
* | --- |
* | "By faculty and department" |
*
* @param {Section_UnitsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_units = /** @type {((inputs?: Section_UnitsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_UnitsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_units(inputs)
	if (locale === "en") return en_section_units(inputs)
	return ru_section_units(inputs)
});