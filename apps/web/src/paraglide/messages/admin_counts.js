/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_CountsInputs */

const ru_admin_counts = /** @type {(inputs: Admin_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Справочники и источники`)
};

const kk_admin_counts = /** @type {(inputs: Admin_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалықтар мен дереккөздер`)
};

const en_admin_counts = /** @type {(inputs: Admin_CountsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionaries and sources`)
};

/**
* | output |
* | --- |
* | "Dictionaries and sources" |
*
* @param {Admin_CountsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_counts = /** @type {((inputs?: Admin_CountsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_CountsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_counts(inputs)
	if (locale === "en") return en_admin_counts(inputs)
	return ru_admin_counts(inputs)
});