/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Units_Unassigned_FootnoteInputs */

const ru_units_unassigned_footnote = /** @type {(inputs: Units_Unassigned_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«Не распределено» - проверки, для которых подразделение проверяющего не сопоставлено.`)
};

const kk_units_unassigned_footnote = /** @type {(inputs: Units_Unassigned_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«Бөлінбеген» - тексерушінің бөлімшесі сәйкестендірілмеген тексерулер.`)
};

const en_units_unassigned_footnote = /** @type {(inputs: Units_Unassigned_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«Unassigned» covers checks whose reviewing unit could not be resolved.`)
};

/**
* | output |
* | --- |
* | "«Unassigned» covers checks whose reviewing unit could not be resolved." |
*
* @param {Units_Unassigned_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_unassigned_footnote = /** @type {((inputs?: Units_Unassigned_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Unassigned_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_units_unassigned_footnote(inputs)
	if (locale === "en") return en_units_unassigned_footnote(inputs)
	return ru_units_unassigned_footnote(inputs)
});