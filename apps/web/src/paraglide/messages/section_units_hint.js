/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Units_HintInputs */

const ru_section_units_hint = /** @type {(inputs: Section_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Показатели по факультетам с раскрытием до кафедр.`)
};

const kk_section_units_hint = /** @type {(inputs: Section_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедраларға дейін ашылатын факультеттер бойынша көрсеткіштер.`)
};

const en_section_units_hint = /** @type {(inputs: Section_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faculty metrics, expandable to departments.`)
};

/**
* | output |
* | --- |
* | "Faculty metrics, expandable to departments." |
*
* @param {Section_Units_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_units_hint = /** @type {((inputs?: Section_Units_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Units_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_units_hint(inputs)
	if (locale === "en") return en_section_units_hint(inputs)
	return ru_section_units_hint(inputs)
});