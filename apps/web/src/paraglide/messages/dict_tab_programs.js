/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Tab_ProgramsInputs */

const ru_dict_tab_programs = /** @type {(inputs: Dict_Tab_ProgramsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Образовательные программы`)
};

const kk_dict_tab_programs = /** @type {(inputs: Dict_Tab_ProgramsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Білім беру бағдарламалары`)
};

const en_dict_tab_programs = /** @type {(inputs: Dict_Tab_ProgramsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Programmes`)
};

/**
* | output |
* | --- |
* | "Programmes" |
*
* @param {Dict_Tab_ProgramsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_programs = /** @type {((inputs?: Dict_Tab_ProgramsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Tab_ProgramsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_tab_programs(inputs)
	if (locale === "en") return en_dict_tab_programs(inputs)
	return ru_dict_tab_programs(inputs)
});