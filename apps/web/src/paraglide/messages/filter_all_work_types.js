/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_All_Work_TypesInputs */

const ru_filter_all_work_types = /** @type {(inputs: Filter_All_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Все типы работ`)
};

const kk_filter_all_work_types = /** @type {(inputs: Filter_All_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыстың барлық түрлері`)
};

const en_filter_all_work_types = /** @type {(inputs: Filter_All_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All work types`)
};

/**
* | output |
* | --- |
* | "All work types" |
*
* @param {Filter_All_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_work_types = /** @type {((inputs?: Filter_All_Work_TypesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_All_Work_TypesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_all_work_types(inputs)
	if (locale === "en") return en_filter_all_work_types(inputs)
	return ru_filter_all_work_types(inputs)
});