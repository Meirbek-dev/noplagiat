/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Sort_OrderInputs */

const ru_dict_sort_order = /** @type {(inputs: Dict_Sort_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Порядок сортировки`)
};

const kk_dict_sort_order = /** @type {(inputs: Dict_Sort_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сұрыптау реті`)
};

const en_dict_sort_order = /** @type {(inputs: Dict_Sort_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sort order`)
};

/**
* | output |
* | --- |
* | "Sort order" |
*
* @param {Dict_Sort_OrderInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_sort_order = /** @type {((inputs?: Dict_Sort_OrderInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Sort_OrderInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_sort_order(inputs)
	if (locale === "en") return en_dict_sort_order(inputs)
	return ru_dict_sort_order(inputs)
});