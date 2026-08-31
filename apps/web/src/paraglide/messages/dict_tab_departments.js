/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Tab_DepartmentsInputs */

const ru_dict_tab_departments = /** @type {(inputs: Dict_Tab_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедры`)
};

const kk_dict_tab_departments = /** @type {(inputs: Dict_Tab_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедралар`)
};

const en_dict_tab_departments = /** @type {(inputs: Dict_Tab_DepartmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Departments`)
};

/**
* | output |
* | --- |
* | "Departments" |
*
* @param {Dict_Tab_DepartmentsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_departments = /** @type {((inputs?: Dict_Tab_DepartmentsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Tab_DepartmentsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_tab_departments(inputs)
	if (locale === "en") return en_dict_tab_departments(inputs)
	return ru_dict_tab_departments(inputs)
});