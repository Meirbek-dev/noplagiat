/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Nav_AreasInputs */

const ru_admin_nav_areas = /** @type {(inputs: Admin_Nav_AreasInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разделы администрирования`)
};

const kk_admin_nav_areas = /** @type {(inputs: Admin_Nav_AreasInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әкімшілендіру бөлімдері`)
};

const en_admin_nav_areas = /** @type {(inputs: Admin_Nav_AreasInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Administration areas`)
};

/**
* | output |
* | --- |
* | "Administration areas" |
*
* @param {Admin_Nav_AreasInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_nav_areas = /** @type {((inputs?: Admin_Nav_AreasInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Nav_AreasInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_nav_areas(inputs)
	if (locale === "en") return en_admin_nav_areas(inputs)
	return ru_admin_nav_areas(inputs)
});