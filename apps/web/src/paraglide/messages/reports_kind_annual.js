/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reports_Kind_AnnualInputs */

const ru_reports_kind_annual = /** @type {(inputs: Reports_Kind_AnnualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Годовой отчёт`)
};

const kk_reports_kind_annual = /** @type {(inputs: Reports_Kind_AnnualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдық есеп`)
};

const en_reports_kind_annual = /** @type {(inputs: Reports_Kind_AnnualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annual report`)
};

/**
* | output |
* | --- |
* | "Annual report" |
*
* @param {Reports_Kind_AnnualInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_kind_annual = /** @type {((inputs?: Reports_Kind_AnnualInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_Kind_AnnualInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_reports_kind_annual(inputs)
	if (locale === "en") return en_reports_kind_annual(inputs)
	return ru_reports_kind_annual(inputs)
});