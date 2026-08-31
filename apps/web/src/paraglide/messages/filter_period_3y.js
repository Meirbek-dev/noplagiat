/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Period_3yInputs */

const ru_filter_period_3y = /** @type {(inputs: Filter_Period_3yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`3 года`)
};

const kk_filter_period_3y = /** @type {(inputs: Filter_Period_3yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`3 жыл`)
};

const en_filter_period_3y = /** @type {(inputs: Filter_Period_3yInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`3 years`)
};

/**
* | output |
* | --- |
* | "3 years" |
*
* @param {Filter_Period_3yInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_3y = /** @type {((inputs?: Filter_Period_3yInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_3yInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_period_3y(inputs)
	if (locale === "en") return en_filter_period_3y(inputs)
	return ru_filter_period_3y(inputs)
});