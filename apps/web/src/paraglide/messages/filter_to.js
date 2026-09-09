/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_ToInputs */

const ru_filter_to = /** @type {(inputs: Filter_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дата окончания`)
};

const kk_filter_to = /** @type {(inputs: Filter_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аяқталу күні`)
};

const en_filter_to = /** @type {(inputs: Filter_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`End date`)
};

/**
* | output |
* | --- |
* | "End date" |
*
* @param {Filter_ToInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_to = /** @type {((inputs?: Filter_ToInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_ToInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_to(inputs)
	if (locale === "en") return en_filter_to(inputs)
	return ru_filter_to(inputs)
});