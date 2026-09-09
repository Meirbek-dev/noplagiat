/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_ParentInputs */

const ru_dict_parent = /** @type {(inputs: Dict_ParentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Родительское подразделение`)
};

const kk_dict_parent = /** @type {(inputs: Dict_ParentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Аталық бөлімше`)
};

const en_dict_parent = /** @type {(inputs: Dict_ParentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Parent unit`)
};

/**
* | output |
* | --- |
* | "Parent unit" |
*
* @param {Dict_ParentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_parent = /** @type {((inputs?: Dict_ParentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_ParentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_parent(inputs)
	if (locale === "en") return en_dict_parent(inputs)
	return ru_dict_parent(inputs)
});