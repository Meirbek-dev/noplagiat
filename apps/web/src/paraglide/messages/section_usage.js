/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_UsageInputs */

const ru_section_usage = /** @type {(inputs: Section_UsageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Использование системы`)
};

const kk_section_usage = /** @type {(inputs: Section_UsageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүйені пайдалану`)
};

const en_section_usage = /** @type {(inputs: Section_UsageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`System usage`)
};

/**
* | output |
* | --- |
* | "System usage" |
*
* @param {Section_UsageInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_usage = /** @type {((inputs?: Section_UsageInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_UsageInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_usage(inputs)
	if (locale === "en") return en_section_usage(inputs)
	return ru_section_usage(inputs)
});