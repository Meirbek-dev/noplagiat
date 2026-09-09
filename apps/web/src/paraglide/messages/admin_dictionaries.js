/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_DictionariesInputs */

const ru_admin_dictionaries = /** @type {(inputs: Admin_DictionariesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Справочники`)
};

const kk_admin_dictionaries = /** @type {(inputs: Admin_DictionariesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалықтар`)
};

const en_admin_dictionaries = /** @type {(inputs: Admin_DictionariesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionaries`)
};

/**
* | output |
* | --- |
* | "Dictionaries" |
*
* @param {Admin_DictionariesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_dictionaries = /** @type {((inputs?: Admin_DictionariesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_DictionariesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_dictionaries(inputs)
	if (locale === "en") return en_admin_dictionaries(inputs)
	return ru_admin_dictionaries(inputs)
});