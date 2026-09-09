/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Dynamics_HintInputs */

const ru_section_dynamics_hint = /** @type {(inputs: Section_Dynamics_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Количество проверок и средняя оригинальность по месяцам.`)
};

const kk_section_dynamics_hint = /** @type {(inputs: Section_Dynamics_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша тексерулер саны және орташа бірегейлік.`)
};

const en_section_dynamics_hint = /** @type {(inputs: Section_Dynamics_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Number of checks and average originality by month.`)
};

/**
* | output |
* | --- |
* | "Number of checks and average originality by month." |
*
* @param {Section_Dynamics_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_dynamics_hint = /** @type {((inputs?: Section_Dynamics_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Dynamics_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_dynamics_hint(inputs)
	if (locale === "en") return en_section_dynamics_hint(inputs)
	return ru_section_dynamics_hint(inputs)
});