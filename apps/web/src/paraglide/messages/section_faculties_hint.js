/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Faculties_HintInputs */

const ru_section_faculties_hint = /** @type {(inputs: Section_Faculties_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Агрегированные показатели по факультетам и институтам.`)
};

const kk_section_faculties_hint = /** @type {(inputs: Section_Faculties_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер мен институттар бойынша жиынтық көрсеткіштер.`)
};

const en_section_faculties_hint = /** @type {(inputs: Section_Faculties_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aggregated figures per faculty and institute.`)
};

/**
* | output |
* | --- |
* | "Aggregated figures per faculty and institute." |
*
* @param {Section_Faculties_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_faculties_hint = /** @type {((inputs?: Section_Faculties_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Faculties_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_faculties_hint(inputs)
	if (locale === "en") return en_section_faculties_hint(inputs)
	return ru_section_faculties_hint(inputs)
});