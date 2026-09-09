/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Work_TypesInputs */

const ru_section_work_types = /** @type {(inputs: Section_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`По типам работ`)
};

const kk_section_work_types = /** @type {(inputs: Section_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері бойынша`)
};

const en_section_work_types = /** @type {(inputs: Section_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By work type`)
};

/**
* | output |
* | --- |
* | "By work type" |
*
* @param {Section_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_work_types = /** @type {((inputs?: Section_Work_TypesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Work_TypesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_work_types(inputs)
	if (locale === "en") return en_section_work_types(inputs)
	return ru_section_work_types(inputs)
});