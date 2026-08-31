/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_UnpublishInputs */

const ru_report_unpublish = /** @type {(inputs: Report_UnpublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Снять с публикации`)
};

const kk_report_unpublish = /** @type {(inputs: Report_UnpublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жариялаудан алу`)
};

const en_report_unpublish = /** @type {(inputs: Report_UnpublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unpublish`)
};

/**
* | output |
* | --- |
* | "Unpublish" |
*
* @param {Report_UnpublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_unpublish = /** @type {((inputs?: Report_UnpublishInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_UnpublishInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_unpublish(inputs)
	if (locale === "en") return en_report_unpublish(inputs)
	return ru_report_unpublish(inputs)
});