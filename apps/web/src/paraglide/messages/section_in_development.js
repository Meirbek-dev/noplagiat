/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ section: NonNullable<unknown> }} Section_In_DevelopmentInputs */

const ru_section_in_development = /** @type {(inputs: Section_In_DevelopmentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.section} - в разработке`)
};

const kk_section_in_development = /** @type {(inputs: Section_In_DevelopmentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.section} - әзірленуде`)
};

const en_section_in_development = /** @type {(inputs: Section_In_DevelopmentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.section} - in development`)
};

/**
* | output |
* | --- |
* | "{section} - in development" |
*
* @param {Section_In_DevelopmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_in_development = /** @type {((inputs: Section_In_DevelopmentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_In_DevelopmentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_in_development(inputs)
	if (locale === "en") return en_section_in_development(inputs)
	return ru_section_in_development(inputs)
});