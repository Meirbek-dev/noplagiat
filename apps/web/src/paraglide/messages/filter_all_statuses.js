/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_All_StatusesInputs */

const ru_filter_all_statuses = /** @type {(inputs: Filter_All_StatusesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Все статусы`)
};

const kk_filter_all_statuses = /** @type {(inputs: Filter_All_StatusesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық мәртебелер`)
};

const en_filter_all_statuses = /** @type {(inputs: Filter_All_StatusesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All statuses`)
};

/**
* | output |
* | --- |
* | "All statuses" |
*
* @param {Filter_All_StatusesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_statuses = /** @type {((inputs?: Filter_All_StatusesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_All_StatusesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_all_statuses(inputs)
	if (locale === "en") return en_filter_all_statuses(inputs)
	return ru_filter_all_statuses(inputs)
});