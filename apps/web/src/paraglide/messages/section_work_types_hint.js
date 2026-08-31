/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Work_Types_HintInputs */

const ru_section_work_types_hint = /** @type {(inputs: Section_Work_Types_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверки и средняя оригинальность в разрезе типов письменных работ.`)
};

const kk_section_work_types_hint = /** @type {(inputs: Section_Work_Types_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жазба жұмыстардың түрлері бойынша тексерулер және орташа бірегейлік.`)
};

const en_section_work_types_hint = /** @type {(inputs: Section_Work_Types_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks and average originality broken down by type of written work.`)
};

/**
* | output |
* | --- |
* | "Checks and average originality broken down by type of written work." |
*
* @param {Section_Work_Types_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_work_types_hint = /** @type {((inputs?: Section_Work_Types_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Work_Types_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_work_types_hint(inputs)
	if (locale === "en") return en_section_work_types_hint(inputs)
	return ru_section_work_types_hint(inputs)
});