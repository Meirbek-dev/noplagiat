/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_ResetInputs */

const ru_filter_reset = /** @type {(inputs: Filter_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сбросить фильтры`)
};

const kk_filter_reset = /** @type {(inputs: Filter_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сүзгілерді тазалау`)
};

const en_filter_reset = /** @type {(inputs: Filter_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reset filters`)
};

/**
* | output |
* | --- |
* | "Reset filters" |
*
* @param {Filter_ResetInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_reset = /** @type {((inputs?: Filter_ResetInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_ResetInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_reset(inputs)
	if (locale === "en") return en_filter_reset(inputs)
	return ru_filter_reset(inputs)
});