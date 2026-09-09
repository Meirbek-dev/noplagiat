/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_ReportsInputs */

const ru_section_reports = /** @type {(inputs: Section_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Опубликованные отчёты`)
};

const kk_section_reports = /** @type {(inputs: Section_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланған есептер`)
};

const en_section_reports = /** @type {(inputs: Section_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Published reports`)
};

/**
* | output |
* | --- |
* | "Published reports" |
*
* @param {Section_ReportsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_reports = /** @type {((inputs?: Section_ReportsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_ReportsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_reports(inputs)
	if (locale === "en") return en_section_reports(inputs)
	return ru_section_reports(inputs)
});