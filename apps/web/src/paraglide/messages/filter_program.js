/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_ProgramInputs */

const ru_filter_program = /** @type {(inputs: Filter_ProgramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Образовательная программа`)
};

const kk_filter_program = /** @type {(inputs: Filter_ProgramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Білім беру бағдарламасы`)
};

const en_filter_program = /** @type {(inputs: Filter_ProgramInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Study program`)
};

/**
* | output |
* | --- |
* | "Study program" |
*
* @param {Filter_ProgramInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program = /** @type {((inputs?: Filter_ProgramInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_ProgramInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_program(inputs)
	if (locale === "en") return en_filter_program(inputs)
	return ru_filter_program(inputs)
});