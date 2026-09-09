/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Overview_HintInputs */

const ru_section_overview_hint = /** @type {(inputs: Section_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ключевые показатели за выбранный период и изменение к тому же периоду годом ранее.`)
};

const kk_section_overview_hint = /** @type {(inputs: Section_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған кезеңнің негізгі көрсеткіштері және бір жыл бұрынғы дәл сол кезеңмен салыстырғандағы өзгерісі.`)
};

const en_section_overview_hint = /** @type {(inputs: Section_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Headline figures for the selected period and the change against the same period a year earlier.`)
};

/**
* | output |
* | --- |
* | "Headline figures for the selected period and the change against the same period a year earlier." |
*
* @param {Section_Overview_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_overview_hint = /** @type {((inputs?: Section_Overview_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Overview_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_overview_hint(inputs)
	if (locale === "en") return en_section_overview_hint(inputs)
	return ru_section_overview_hint(inputs)
});