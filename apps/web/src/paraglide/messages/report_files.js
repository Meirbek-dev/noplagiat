/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_FilesInputs */

const ru_report_files = /** @type {(inputs: Report_FilesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Файлы`)
};

const kk_report_files = /** @type {(inputs: Report_FilesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Файлдар`)
};

const en_report_files = /** @type {(inputs: Report_FilesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Files`)
};

/**
* | output |
* | --- |
* | "Files" |
*
* @param {Report_FilesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_files = /** @type {((inputs?: Report_FilesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_FilesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_files(inputs)
	if (locale === "en") return en_report_files(inputs)
	return ru_report_files(inputs)
});