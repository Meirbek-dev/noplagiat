/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Period_5yInputs */

const ru_filter_period_5y = /** @type {(inputs: Filter_Period_5yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`5 лет`)
};

const kk_filter_period_5y = /** @type {(inputs: Filter_Period_5yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`5 жыл`)
};

const en_filter_period_5y = /** @type {(inputs: Filter_Period_5yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`5 years`)
};

/**
* | output |
* | --- |
* | "5 years" |
*
* @param {Filter_Period_5yInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_5y = /** @type {((inputs?: Filter_Period_5yInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_5yInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_period_5y(inputs)
	if (locale === "en") return en_filter_period_5y(inputs)
	return ru_filter_period_5y(inputs)
});