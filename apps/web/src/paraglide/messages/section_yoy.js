/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_YoyInputs */

const ru_section_yoy = /** @type {(inputs: Section_YoyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Год к году`)
};

const kk_section_yoy = /** @type {(inputs: Section_YoyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдан жылға`)
};

const en_section_yoy = /** @type {(inputs: Section_YoyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Year over year`)
};

/**
* | output |
* | --- |
* | "Year over year" |
*
* @param {Section_YoyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_yoy = /** @type {((inputs?: Section_YoyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_YoyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_yoy(inputs)
	if (locale === "en") return en_section_yoy(inputs)
	return ru_section_yoy(inputs)
});