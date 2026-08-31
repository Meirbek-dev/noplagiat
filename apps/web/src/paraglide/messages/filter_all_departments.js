/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_All_DepartmentsInputs */

const ru_filter_all_departments = /** @type {(inputs: Filter_All_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Все кафедры`)
};

const kk_filter_all_departments = /** @type {(inputs: Filter_All_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Барлық кафедралар`)
};

const en_filter_all_departments = /** @type {(inputs: Filter_All_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All departments`)
};

/**
* | output |
* | --- |
* | "All departments" |
*
* @param {Filter_All_DepartmentsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_all_departments = /** @type {((inputs?: Filter_All_DepartmentsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_All_DepartmentsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_all_departments(inputs)
	if (locale === "en") return en_filter_all_departments(inputs)
	return ru_filter_all_departments(inputs)
});