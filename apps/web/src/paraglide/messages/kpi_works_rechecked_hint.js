/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Works_Rechecked_HintInputs */

const ru_kpi_works_rechecked_hint = /** @type {(inputs: Kpi_Works_Rechecked_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Работ более чем с одной попыткой`)
};

const kk_kpi_works_rechecked_hint = /** @type {(inputs: Kpi_Works_Rechecked_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірден көп әрекеті бар жұмыстар`)
};

const en_kpi_works_rechecked_hint = /** @type {(inputs: Kpi_Works_Rechecked_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Works with more than one attempt`)
};

/**
* | output |
* | --- |
* | "Works with more than one attempt" |
*
* @param {Kpi_Works_Rechecked_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_rechecked_hint = /** @type {((inputs?: Kpi_Works_Rechecked_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Works_Rechecked_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_works_rechecked_hint(inputs)
	if (locale === "en") return en_kpi_works_rechecked_hint(inputs)
	return ru_kpi_works_rechecked_hint(inputs)
});