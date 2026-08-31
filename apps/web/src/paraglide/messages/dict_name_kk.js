/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Name_KkInputs */

const ru_dict_name_kk = /** @type {(inputs: Dict_Name_KkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Наименование (KK)`)
};

const kk_dict_name_kk = /** @type {(inputs: Dict_Name_KkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Атауы (KK)`)
};

const en_dict_name_kk = /** @type {(inputs: Dict_Name_KkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name (KK)`)
};

/**
* | output |
* | --- |
* | "Name (KK)" |
*
* @param {Dict_Name_KkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_name_kk = /** @type {((inputs?: Dict_Name_KkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Name_KkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_name_kk(inputs)
	if (locale === "en") return en_dict_name_kk(inputs)
	return ru_dict_name_kk(inputs)
});