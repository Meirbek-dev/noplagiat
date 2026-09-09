/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Internal_Nav_ToggleInputs */

const ru_internal_nav_toggle = /** @type {(inputs: Internal_Nav_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Показать или скрыть меню`)
};

const kk_internal_nav_toggle = /** @type {(inputs: Internal_Nav_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мәзірді көрсету немесе жасыру`)
};

const en_internal_nav_toggle = /** @type {(inputs: Internal_Nav_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show or hide the menu`)
};

/**
* | output |
* | --- |
* | "Show or hide the menu" |
*
* @param {Internal_Nav_ToggleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_toggle = /** @type {((inputs?: Internal_Nav_ToggleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Nav_ToggleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_internal_nav_toggle(inputs)
	if (locale === "en") return en_internal_nav_toggle(inputs)
	return ru_internal_nav_toggle(inputs)
});