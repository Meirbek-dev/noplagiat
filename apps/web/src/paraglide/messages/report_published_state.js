/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Published_StateInputs */

const ru_report_published_state = /** @type {(inputs: Report_Published_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Публикация`)
};

const kk_report_published_state = /** @type {(inputs: Report_Published_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жариялану`)
};

const en_report_published_state = /** @type {(inputs: Report_Published_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Publication`)
};

/**
* | output |
* | --- |
* | "Publication" |
*
* @param {Report_Published_StateInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_published_state = /** @type {((inputs?: Report_Published_StateInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Published_StateInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_published_state(inputs)
	if (locale === "en") return en_report_published_state(inputs)
	return ru_report_published_state(inputs)
});