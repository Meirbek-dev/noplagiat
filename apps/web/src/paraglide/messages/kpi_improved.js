/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_ImprovedInputs */

const ru_kpi_improved = /** @type {(inputs: Kpi_ImprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`С улучшением`)
};

const kk_kpi_improved = /** @type {(inputs: Kpi_ImprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жақсарғаны`)
};

const en_kpi_improved = /** @type {(inputs: Kpi_ImprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Improved`)
};

/**
* | output |
* | --- |
* | "Improved" |
*
* @param {Kpi_ImprovedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved = /** @type {((inputs?: Kpi_ImprovedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_ImprovedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_improved(inputs)
	if (locale === "en") return en_kpi_improved(inputs)
	return ru_kpi_improved(inputs)
});