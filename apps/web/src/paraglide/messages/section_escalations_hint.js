/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Escalations_HintInputs */

const ru_section_escalations_hint = /** @type {(inputs: Section_Escalations_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Агрегированные счётчики дел, переданных в Совет по этике, без персональных данных.`)
};

const kk_section_escalations_hint = /** @type {(inputs: Section_Escalations_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Этика кеңесіне берілген істердің жиынтық санауыштары, дербес деректерсіз.`)
};

const en_section_escalations_hint = /** @type {(inputs: Section_Escalations_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aggregated counters of cases referred to the Ethics Council, with no personal data.`)
};

/**
* | output |
* | --- |
* | "Aggregated counters of cases referred to the Ethics Council, with no personal data." |
*
* @param {Section_Escalations_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_escalations_hint = /** @type {((inputs?: Section_Escalations_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Escalations_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_escalations_hint(inputs)
	if (locale === "en") return en_section_escalations_hint(inputs)
	return ru_section_escalations_hint(inputs)
});