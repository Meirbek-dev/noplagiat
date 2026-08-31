/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Tab_Work_TypesInputs */

const ru_dict_tab_work_types = /** @type {(inputs: Dict_Tab_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Типы работ`)
};

const kk_dict_tab_work_types = /** @type {(inputs: Dict_Tab_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері`)
};

const en_dict_tab_work_types = /** @type {(inputs: Dict_Tab_Work_TypesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work types`)
};

/**
* | output |
* | --- |
* | "Work types" |
*
* @param {Dict_Tab_Work_TypesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_tab_work_types = /** @type {((inputs?: Dict_Tab_Work_TypesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Tab_Work_TypesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_tab_work_types(inputs)
	if (locale === "en") return en_dict_tab_work_types(inputs)
	return ru_dict_tab_work_types(inputs)
});