/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_ActiveInputs */

const ru_dict_active = /** @type {(inputs: Dict_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Активна`)
};

const kk_dict_active = /** @type {(inputs: Dict_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белсенді`)
};

const en_dict_active = /** @type {(inputs: Dict_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

/**
* | output |
* | --- |
* | "Active" |
*
* @param {Dict_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active = /** @type {((inputs?: Dict_ActiveInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_ActiveInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_active(inputs)
	if (locale === "en") return en_dict_active(inputs)
	return ru_dict_active(inputs)
});