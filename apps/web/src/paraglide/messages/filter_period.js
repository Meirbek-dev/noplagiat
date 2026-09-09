/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_PeriodInputs */

const ru_filter_period = /** @type {(inputs: Filter_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Период`)
};

const kk_filter_period = /** @type {(inputs: Filter_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезең`)
};

const en_filter_period = /** @type {(inputs: Filter_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period`)
};

/**
* | output |
* | --- |
* | "Period" |
*
* @param {Filter_PeriodInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period = /** @type {((inputs?: Filter_PeriodInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_PeriodInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_period(inputs)
	if (locale === "en") return en_filter_period(inputs)
	return ru_filter_period(inputs)
});