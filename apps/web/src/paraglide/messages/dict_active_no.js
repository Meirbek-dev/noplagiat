/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Active_NoInputs */

const ru_dict_active_no = /** @type {(inputs: Dict_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Нет`)
};

const kk_dict_active_no = /** @type {(inputs: Dict_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жоқ`)
};

const en_dict_active_no = /** @type {(inputs: Dict_Active_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No`)
};

/**
* | output |
* | --- |
* | "No" |
*
* @param {Dict_Active_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active_no = /** @type {((inputs?: Dict_Active_NoInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Active_NoInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_active_no(inputs)
	if (locale === "en") return en_dict_active_no(inputs)
	return ru_dict_active_no(inputs)
});