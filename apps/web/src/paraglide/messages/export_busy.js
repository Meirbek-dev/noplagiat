/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Export_BusyInputs */

const ru_export_busy = /** @type {(inputs: Export_BusyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Формируется…`)
};

const kk_export_busy = /** @type {(inputs: Export_BusyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дайындалуда…`)
};

const en_export_busy = /** @type {(inputs: Export_BusyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preparing…`)
};

/**
* | output |
* | --- |
* | "Preparing…" |
*
* @param {Export_BusyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_busy = /** @type {((inputs?: Export_BusyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_BusyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_export_busy(inputs)
	if (locale === "en") return en_export_busy(inputs)
	return ru_export_busy(inputs)
});