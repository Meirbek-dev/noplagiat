/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Work_TypeInputs */

const ru_filter_work_type = /** @type {(inputs: Filter_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тип работы`)
};

const kk_filter_work_type = /** @type {(inputs: Filter_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрі`)
};

const en_filter_work_type = /** @type {(inputs: Filter_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work type`)
};

/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Filter_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_work_type = /** @type {((inputs?: Filter_Work_TypeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Work_TypeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_work_type(inputs)
	if (locale === "en") return en_filter_work_type(inputs)
	return ru_filter_work_type(inputs)
});