/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_PublishInputs */

const ru_report_publish = /** @type {(inputs: Report_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Опубликовать`)
};

const kk_report_publish = /** @type {(inputs: Report_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жариялау`)
};

const en_report_publish = /** @type {(inputs: Report_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Publish`)
};

/**
* | output |
* | --- |
* | "Publish" |
*
* @param {Report_PublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_publish = /** @type {((inputs?: Report_PublishInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_PublishInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_publish(inputs)
	if (locale === "en") return en_report_publish(inputs)
	return ru_report_publish(inputs)
});