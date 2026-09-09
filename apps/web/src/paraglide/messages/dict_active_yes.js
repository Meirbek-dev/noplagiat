/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Active_YesInputs */

const ru_dict_active_yes = /** @type {(inputs: Dict_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Да`)
};

const kk_dict_active_yes = /** @type {(inputs: Dict_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Иә`)
};

const en_dict_active_yes = /** @type {(inputs: Dict_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yes`)
};

/**
* | output |
* | --- |
* | "Yes" |
*
* @param {Dict_Active_YesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_active_yes = /** @type {((inputs?: Dict_Active_YesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Active_YesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_active_yes(inputs)
	if (locale === "en") return en_dict_active_yes(inputs)
	return ru_dict_active_yes(inputs)
});