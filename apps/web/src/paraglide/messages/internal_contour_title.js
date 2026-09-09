/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Internal_Contour_TitleInputs */

const ru_internal_contour_title = /** @type {(inputs: Internal_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Внутренняя аналитика антиплагиата`)
};

const kk_internal_contour_title = /** @type {(inputs: Internal_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Антиплагиаттың ішкі аналитикасы`)
};

const en_internal_contour_title = /** @type {(inputs: Internal_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Internal Antiplagiarism Analytics`)
};

/**
* | output |
* | --- |
* | "Internal Antiplagiarism Analytics" |
*
* @param {Internal_Contour_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_contour_title = /** @type {((inputs?: Internal_Contour_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Contour_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_internal_contour_title(inputs)
	if (locale === "en") return en_internal_contour_title(inputs)
	return ru_internal_contour_title(inputs)
});