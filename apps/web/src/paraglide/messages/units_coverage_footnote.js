/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Units_Coverage_FootnoteInputs */

const ru_units_coverage_footnote = /** @type {(inputs: Units_Coverage_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разбивка по подразделениям доступна с 2025/26 учебного года.`)
};

const kk_units_coverage_footnote = /** @type {(inputs: Units_Coverage_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша бөлініс 2025/26 оқу жылынан бастап қолжетімді.`)
};

const en_units_coverage_footnote = /** @type {(inputs: Units_Coverage_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The breakdown by unit is available from the 2025/26 academic year.`)
};

/**
* | output |
* | --- |
* | "The breakdown by unit is available from the 2025/26 academic year." |
*
* @param {Units_Coverage_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_coverage_footnote = /** @type {((inputs?: Units_Coverage_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Coverage_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_units_coverage_footnote(inputs)
	if (locale === "en") return en_units_coverage_footnote(inputs)
	return ru_units_coverage_footnote(inputs)
});