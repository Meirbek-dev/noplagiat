/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_UnpublishedInputs */

const ru_report_unpublished = /** @type {(inputs: Report_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не опубликован`)
};

const kk_report_unpublished = /** @type {(inputs: Report_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланбаған`)
};

const en_report_unpublished = /** @type {(inputs: Report_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not published`)
};

/**
* | output |
* | --- |
* | "Not published" |
*
* @param {Report_UnpublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_unpublished = /** @type {((inputs?: Report_UnpublishedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_UnpublishedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_unpublished(inputs)
	if (locale === "en") return en_report_unpublished(inputs)
	return ru_report_unpublished(inputs)
});