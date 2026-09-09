/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Reports_HintInputs */

const ru_section_reports_hint = /** @type {(inputs: Section_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Годовые и периодические обезличенные отчёты.`)
};

const kk_section_reports_hint = /** @type {(inputs: Section_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдық және кезеңдік дербестендірілмеген есептер.`)
};

const en_section_reports_hint = /** @type {(inputs: Section_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annual and ad-hoc anonymized reports.`)
};

/**
* | output |
* | --- |
* | "Annual and ad-hoc anonymized reports." |
*
* @param {Section_Reports_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_reports_hint = /** @type {((inputs?: Section_Reports_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Reports_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_reports_hint(inputs)
	if (locale === "en") return en_section_reports_hint(inputs)
	return ru_section_reports_hint(inputs)
});