/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_PublishedInputs */

const ru_report_published = /** @type {(inputs: Report_PublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Опубликован`)
};

const kk_report_published = /** @type {(inputs: Report_PublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланған`)
};

const en_report_published = /** @type {(inputs: Report_PublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Published`)
};

/**
* | output |
* | --- |
* | "Published" |
*
* @param {Report_PublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_published = /** @type {((inputs?: Report_PublishedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_PublishedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_published(inputs)
	if (locale === "en") return en_report_published(inputs)
	return ru_report_published(inputs)
});