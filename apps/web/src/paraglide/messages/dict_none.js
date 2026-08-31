/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_NoneInputs */

const ru_dict_none = /** @type {(inputs: Dict_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Справочник пуст.`)
};

const kk_dict_none = /** @type {(inputs: Dict_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық бос.`)
};

const en_dict_none = /** @type {(inputs: Dict_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The dictionary is empty.`)
};

/**
* | output |
* | --- |
* | "The dictionary is empty." |
*
* @param {Dict_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_none = /** @type {((inputs?: Dict_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_none(inputs)
	if (locale === "en") return en_dict_none(inputs)
	return ru_dict_none(inputs)
});