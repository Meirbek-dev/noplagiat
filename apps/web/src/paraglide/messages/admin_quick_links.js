/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Quick_LinksInputs */

const ru_admin_quick_links = /** @type {(inputs: Admin_Quick_LinksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Быстрые переходы`)
};

const kk_admin_quick_links = /** @type {(inputs: Admin_Quick_LinksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жылдам өтулер`)
};

const en_admin_quick_links = /** @type {(inputs: Admin_Quick_LinksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quick links`)
};

/**
* | output |
* | --- |
* | "Quick links" |
*
* @param {Admin_Quick_LinksInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_quick_links = /** @type {((inputs?: Admin_Quick_LinksInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Quick_LinksInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_quick_links(inputs)
	if (locale === "en") return en_admin_quick_links(inputs)
	return ru_admin_quick_links(inputs)
});