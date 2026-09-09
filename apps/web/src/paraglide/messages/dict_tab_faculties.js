/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Tab_FacultiesInputs */

const ru_dict_tab_faculties = /** @type {(inputs: Dict_Tab_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеты`)
};

const kk_dict_tab_faculties = /** @type {(inputs: Dict_Tab_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер`)
};

const en_dict_tab_faculties = /** @type {(inputs: Dict_Tab_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faculties`)
};

/**
* | output |
* | --- |
* | "Faculties" |
*
* @param {Dict_Tab_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_faculties = /** @type {((inputs?: Dict_Tab_FacultiesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Tab_FacultiesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_tab_faculties(inputs)
	if (locale === "en") return en_dict_tab_faculties(inputs)
	return ru_dict_tab_faculties(inputs)
});