/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_DepartmentInputs */

const ru_filter_department = /** @type {(inputs: Filter_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра`)
};

const kk_filter_department = /** @type {(inputs: Filter_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра`)
};

const en_filter_department = /** @type {(inputs: Filter_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Department`)
};

/**
* | output |
* | --- |
* | "Department" |
*
* @param {Filter_DepartmentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_department = /** @type {((inputs?: Filter_DepartmentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_DepartmentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_department(inputs)
	if (locale === "en") return en_filter_department(inputs)
	return ru_filter_department(inputs)
});