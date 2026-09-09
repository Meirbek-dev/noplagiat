/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Yoy_HintInputs */

const ru_section_yoy_hint = /** @type {(inputs: Section_Yoy_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сравнение показателей по учебным годам (1 сентября - 31 августа).`)
};

const kk_section_yoy_hint = /** @type {(inputs: Section_Yoy_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Көрсеткіштерді оқу жылдары бойынша салыстыру (1 қыркүйек - 31 тамыз).`)
};

const en_section_yoy_hint = /** @type {(inputs: Section_Yoy_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The figures compared by academic year (1 September - 31 August).`)
};

/**
* | output |
* | --- |
* | "The figures compared by academic year (1 September - 31 August)." |
*
* @param {Section_Yoy_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_yoy_hint = /** @type {((inputs?: Section_Yoy_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Yoy_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_yoy_hint(inputs)
	if (locale === "en") return en_section_yoy_hint(inputs)
	return ru_section_yoy_hint(inputs)
});