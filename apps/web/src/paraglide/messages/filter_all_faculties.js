/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_All_FacultiesInputs */

const ru_filter_all_faculties = /** @type {(inputs: Filter_All_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Все факультеты`)
};

const kk_filter_all_faculties = /** @type {(inputs: Filter_All_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық факультеттер`)
};

const en_filter_all_faculties = /** @type {(inputs: Filter_All_FacultiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All faculties`)
};

/**
* | output |
* | --- |
* | "All faculties" |
*
* @param {Filter_All_FacultiesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_faculties = /** @type {((inputs?: Filter_All_FacultiesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_All_FacultiesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_all_faculties(inputs)
	if (locale === "en") return en_filter_all_faculties(inputs)
	return ru_filter_all_faculties(inputs)
});