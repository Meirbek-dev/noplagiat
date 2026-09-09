/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Parent_NoneInputs */

const ru_dict_parent_none = /** @type {(inputs: Dict_Parent_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не выбрано`)
};

const kk_dict_parent_none = /** @type {(inputs: Dict_Parent_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалмаған`)
};

const en_dict_parent_none = /** @type {(inputs: Dict_Parent_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not selected`)
};

/**
* | output |
* | --- |
* | "Not selected" |
*
* @param {Dict_Parent_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_parent_none = /** @type {((inputs?: Dict_Parent_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Parent_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_parent_none(inputs)
	if (locale === "en") return en_dict_parent_none(inputs)
	return ru_dict_parent_none(inputs)
});