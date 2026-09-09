/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Period_YearInputs */

const ru_filter_period_year = /** @type {(inputs: Filter_Period_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Учебный год`)
};

const kk_filter_period_year = /** @type {(inputs: Filter_Period_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оқу жылы`)
};

const en_filter_period_year = /** @type {(inputs: Filter_Period_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic year`)
};

/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Filter_Period_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_year = /** @type {((inputs?: Filter_Period_YearInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_YearInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_period_year(inputs)
	if (locale === "en") return en_filter_period_year(inputs)
	return ru_filter_period_year(inputs)
});