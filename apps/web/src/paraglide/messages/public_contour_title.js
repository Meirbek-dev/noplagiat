/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Public_Contour_TitleInputs */

const ru_public_contour_title = /** @type {(inputs: Public_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Академическая честность - открытая статистика`)
};

const kk_public_contour_title = /** @type {(inputs: Public_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Академиялық адалдық - ашық статистика`)
};

const en_public_contour_title = /** @type {(inputs: Public_Contour_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic Integrity - Open Statistics`)
};

/**
* | output |
* | --- |
* | "Academic Integrity - Open Statistics" |
*
* @param {Public_Contour_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const public_contour_title = /** @type {((inputs?: Public_Contour_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Public_Contour_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_public_contour_title(inputs)
	if (locale === "en") return en_public_contour_title(inputs)
	return ru_public_contour_title(inputs)
});