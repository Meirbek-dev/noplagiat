/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_EscalationsInputs */

const ru_section_escalations = /** @type {(inputs: Section_EscalationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалации`)
};

const kk_section_escalations = /** @type {(inputs: Section_EscalationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалациялар`)
};

const en_section_escalations = /** @type {(inputs: Section_EscalationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations`)
};

/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Section_EscalationsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_escalations = /** @type {((inputs?: Section_EscalationsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_EscalationsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_escalations(inputs)
	if (locale === "en") return en_section_escalations(inputs)
	return ru_section_escalations(inputs)
});