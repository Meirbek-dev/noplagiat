/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_StatusInputs */

const ru_filter_status = /** @type {(inputs: Filter_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Статус проверки`)
};

const kk_filter_status = /** @type {(inputs: Filter_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексеру мәртебесі`)
};

const en_filter_status = /** @type {(inputs: Filter_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check status`)
};

/**
* | output |
* | --- |
* | "Check status" |
*
* @param {Filter_StatusInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_status = /** @type {((inputs?: Filter_StatusInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_StatusInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_status(inputs)
	if (locale === "en") return en_filter_status(inputs)
	return ru_filter_status(inputs)
});