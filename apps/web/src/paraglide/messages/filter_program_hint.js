/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Program_HintInputs */

const ru_filter_program_hint = /** @type {(inputs: Filter_Program_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Укажите код образовательной программы - выбор из списка пока недоступен.`)
};

const kk_filter_program_hint = /** @type {(inputs: Filter_Program_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Білім беру бағдарламасының кодын енгізіңіз - тізімнен таңдау әзірге қолжетімсіз.`)
};

const en_filter_program_hint = /** @type {(inputs: Filter_Program_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter the study-programme code - picking from a list is not available yet.`)
};

/**
* | output |
* | --- |
* | "Enter the study-programme code - picking from a list is not available yet." |
*
* @param {Filter_Program_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program_hint = /** @type {((inputs?: Filter_Program_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Program_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_program_hint(inputs)
	if (locale === "en") return en_filter_program_hint(inputs)
	return ru_filter_program_hint(inputs)
});