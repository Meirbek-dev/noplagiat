/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_TitleInputs */

const ru_admin_title = /** @type {(inputs: Admin_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Администрирование`)
};

const kk_admin_title = /** @type {(inputs: Admin_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әкімшілендіру`)
};

const en_admin_title = /** @type {(inputs: Admin_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Administration`)
};

/**
* | output |
* | --- |
* | "Administration" |
*
* @param {Admin_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_title = /** @type {((inputs?: Admin_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_title(inputs)
	if (locale === "en") return en_admin_title(inputs)
	return ru_admin_title(inputs)
});