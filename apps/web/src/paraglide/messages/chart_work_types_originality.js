/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Work_Types_OriginalityInputs */

const ru_chart_work_types_originality = /** @type {(inputs: Chart_Work_Types_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оригинальность по типам работ`)
};

const kk_chart_work_types_originality = /** @type {(inputs: Chart_Work_Types_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері бойынша бірегейлік`)
};

const en_chart_work_types_originality = /** @type {(inputs: Chart_Work_Types_OriginalityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originality by work type`)
};

/**
* | output |
* | --- |
* | "Originality by work type" |
*
* @param {Chart_Work_Types_OriginalityInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_work_types_originality = /** @type {((inputs?: Chart_Work_Types_OriginalityInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Work_Types_OriginalityInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_work_types_originality(inputs)
	if (locale === "en") return en_chart_work_types_originality(inputs)
	return ru_chart_work_types_originality(inputs)
});