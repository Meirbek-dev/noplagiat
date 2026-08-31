/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_DynamicsInputs */

const ru_section_dynamics = /** @type {(inputs: Section_DynamicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Динамика во времени`)
};

const kk_section_dynamics = /** @type {(inputs: Section_DynamicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Уақыт бойынша динамика`)
};

const en_section_dynamics = /** @type {(inputs: Section_DynamicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trends over time`)
};

/**
* | output |
* | --- |
* | "Trends over time" |
*
* @param {Section_DynamicsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_dynamics = /** @type {((inputs?: Section_DynamicsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_DynamicsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_dynamics(inputs)
	if (locale === "en") return en_section_dynamics(inputs)
	return ru_section_dynamics(inputs)
});