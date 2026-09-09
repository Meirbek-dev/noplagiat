/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_FromInputs */

const ru_filter_from = /** @type {(inputs: Filter_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дата начала`)
};

const kk_filter_from = /** @type {(inputs: Filter_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басталу күні`)
};

const en_filter_from = /** @type {(inputs: Filter_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start date`)
};

/**
* | output |
* | --- |
* | "Start date" |
*
* @param {Filter_FromInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_from = /** @type {((inputs?: Filter_FromInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_FromInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_from(inputs)
	if (locale === "en") return en_filter_from(inputs)
	return ru_filter_from(inputs)
});