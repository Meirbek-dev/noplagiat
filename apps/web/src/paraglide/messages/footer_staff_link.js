/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Footer_Staff_LinkInputs */

const ru_footer_staff_link = /** @type {(inputs: Footer_Staff_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вход для сотрудников`)
};

const kk_footer_staff_link = /** @type {(inputs: Footer_Staff_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қызметкерлер үшін кіру`)
};

const en_footer_staff_link = /** @type {(inputs: Footer_Staff_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Staff sign-in`)
};

/**
* | output |
* | --- |
* | "Staff sign-in" |
*
* @param {Footer_Staff_LinkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_staff_link = /** @type {((inputs?: Footer_Staff_LinkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_Staff_LinkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_footer_staff_link(inputs)
	if (locale === "en") return en_footer_staff_link(inputs)
	return ru_footer_staff_link(inputs)
});