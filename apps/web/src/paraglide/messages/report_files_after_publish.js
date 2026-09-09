/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Files_After_PublishInputs */

const ru_report_files_after_publish = /** @type {(inputs: Report_Files_After_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Доступны после публикации`)
};

const kk_report_files_after_publish = /** @type {(inputs: Report_Files_After_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланғаннан кейін қолжетімді`)
};

const en_report_files_after_publish = /** @type {(inputs: Report_Files_After_PublishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Available once published`)
};

/**
* | output |
* | --- |
* | "Available once published" |
*
* @param {Report_Files_After_PublishInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_files_after_publish = /** @type {((inputs?: Report_Files_After_PublishInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Files_After_PublishInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_files_after_publish(inputs)
	if (locale === "en") return en_report_files_after_publish(inputs)
	return ru_report_files_after_publish(inputs)
});