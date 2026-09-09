/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_OverviewInputs */

const ru_section_overview = /** @type {(inputs: Section_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Обзорная сводка`)
};

const kk_section_overview = /** @type {(inputs: Section_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шолу қорытындысы`)
};

const en_section_overview = /** @type {(inputs: Section_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Overview`)
};

/**
* | output |
* | --- |
* | "Overview" |
*
* @param {Section_OverviewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_overview = /** @type {((inputs?: Section_OverviewInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_OverviewInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_overview(inputs)
	if (locale === "en") return en_section_overview(inputs)
	return ru_section_overview(inputs)
});