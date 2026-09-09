/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Name_RuInputs */

const ru_dict_name_ru = /** @type {(inputs: Dict_Name_RuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Наименование (RU)`)
};

const kk_dict_name_ru = /** @type {(inputs: Dict_Name_RuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Атауы (RU)`)
};

const en_dict_name_ru = /** @type {(inputs: Dict_Name_RuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name (RU)`)
};

/**
* | output |
* | --- |
* | "Name (RU)" |
*
* @param {Dict_Name_RuInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_ru = /** @type {((inputs?: Dict_Name_RuInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Name_RuInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_name_ru(inputs)
	if (locale === "en") return en_dict_name_ru(inputs)
	return ru_dict_name_ru(inputs)
});