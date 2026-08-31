/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Work_Types_CountsInputs */

const ru_chart_work_types_counts = /** @type {(inputs: Chart_Work_Types_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверки по типам работ`)
};

const kk_chart_work_types_counts = /** @type {(inputs: Chart_Work_Types_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері бойынша тексерулер`)
};

const en_chart_work_types_counts = /** @type {(inputs: Chart_Work_Types_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks by work type`)
};

/**
* | output |
* | --- |
* | "Checks by work type" |
*
* @param {Chart_Work_Types_CountsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_work_types_counts = /** @type {((inputs?: Chart_Work_Types_CountsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Work_Types_CountsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_work_types_counts(inputs)
	if (locale === "en") return en_chart_work_types_counts(inputs)
	return ru_chart_work_types_counts(inputs)
});