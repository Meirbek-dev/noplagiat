/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reports_Kind_ManualInputs */

const ru_reports_kind_manual = /** @type {(inputs: Reports_Kind_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отчёт за период`)
};

const kk_reports_kind_manual = /** @type {(inputs: Reports_Kind_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезеңдік есеп`)
};

const en_reports_kind_manual = /** @type {(inputs: Reports_Kind_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period report`)
};

/**
* | output |
* | --- |
* | "Period report" |
*
* @param {Reports_Kind_ManualInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_kind_manual = /** @type {((inputs?: Reports_Kind_ManualInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_Kind_ManualInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_reports_kind_manual(inputs)
	if (locale === "en") return en_reports_kind_manual(inputs)
	return ru_reports_kind_manual(inputs)
});