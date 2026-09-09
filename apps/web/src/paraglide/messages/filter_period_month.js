/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Period_MonthInputs */

const ru_filter_period_month = /** @type {(inputs: Filter_Period_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Месяц`)
};

const kk_filter_period_month = /** @type {(inputs: Filter_Period_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ай`)
};

const en_filter_period_month = /** @type {(inputs: Filter_Period_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Month`)
};

/**
* | output |
* | --- |
* | "Month" |
*
* @param {Filter_Period_MonthInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_month = /** @type {((inputs?: Filter_Period_MonthInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_MonthInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_period_month(inputs)
	if (locale === "en") return en_filter_period_month(inputs)
	return ru_filter_period_month(inputs)
});