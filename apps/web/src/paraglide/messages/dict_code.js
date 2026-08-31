/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_CodeInputs */

const ru_dict_code = /** @type {(inputs: Dict_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Код`)
};

const kk_dict_code = /** @type {(inputs: Dict_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Коды`)
};

const en_dict_code = /** @type {(inputs: Dict_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Code`)
};

/**
* | output |
* | --- |
* | "Code" |
*
* @param {Dict_CodeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_code = /** @type {((inputs?: Dict_CodeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_CodeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_code(inputs)
	if (locale === "en") return en_dict_code(inputs)
	return ru_dict_code(inputs)
});