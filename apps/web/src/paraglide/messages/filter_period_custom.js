/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Period_CustomInputs */

const ru_filter_period_custom = /** @type {(inputs: Filter_Period_CustomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Произвольный`)
};

const kk_filter_period_custom = /** @type {(inputs: Filter_Period_CustomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Еркін кезең`)
};

const en_filter_period_custom = /** @type {(inputs: Filter_Period_CustomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Custom`)
};

/**
* | output |
* | --- |
* | "Custom" |
*
* @param {Filter_Period_CustomInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_custom = /** @type {((inputs?: Filter_Period_CustomInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_CustomInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_period_custom(inputs)
	if (locale === "en") return en_filter_period_custom(inputs)
	return ru_filter_period_custom(inputs)
});