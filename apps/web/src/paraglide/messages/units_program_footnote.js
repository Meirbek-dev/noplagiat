/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Units_Program_FootnoteInputs */

const ru_units_program_footnote = /** @type {(inputs: Units_Program_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разбивка по образовательным программам пока недоступна.`)
};

const kk_units_program_footnote = /** @type {(inputs: Units_Program_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Білім беру бағдарламалары бойынша бөлініс әзірге қолжетімсіз.`)
};

const en_units_program_footnote = /** @type {(inputs: Units_Program_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A breakdown by study programme is not available yet.`)
};

/**
* | output |
* | --- |
* | "A breakdown by study programme is not available yet." |
*
* @param {Units_Program_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_program_footnote = /** @type {((inputs?: Units_Program_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Program_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_units_program_footnote(inputs)
	if (locale === "en") return en_units_program_footnote(inputs)
	return ru_units_program_footnote(inputs)
});