/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ format: NonNullable<unknown> }} Reports_DownloadInputs */

const ru_reports_download = /** @type {(inputs: Reports_DownloadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Скачать ${i?.format}`)
};

const kk_reports_download = /** @type {(inputs: Reports_DownloadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.format} жүктеп алу`)
};

const en_reports_download = /** @type {(inputs: Reports_DownloadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Download ${i?.format}`)
};

/**
* | output |
* | --- |
* | "Download {format}" |
*
* @param {Reports_DownloadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_download = /** @type {((inputs: Reports_DownloadInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_DownloadInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_reports_download(inputs)
	if (locale === "en") return en_reports_download(inputs)
	return ru_reports_download(inputs)
});