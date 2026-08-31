/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Name_EnInputs */

const ru_dict_name_en = /** @type {(inputs: Dict_Name_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Наименование (EN)`)
};

const kk_dict_name_en = /** @type {(inputs: Dict_Name_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Атауы (EN)`)
};

const en_dict_name_en = /** @type {(inputs: Dict_Name_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name (EN)`)
};

/**
* | output |
* | --- |
* | "Name (EN)" |
*
* @param {Dict_Name_EnInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_en = /** @type {((inputs?: Dict_Name_EnInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Name_EnInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_name_en(inputs)
	if (locale === "en") return en_dict_name_en(inputs)
	return ru_dict_name_en(inputs)
});