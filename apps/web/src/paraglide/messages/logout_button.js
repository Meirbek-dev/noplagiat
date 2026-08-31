/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Logout_ButtonInputs */

const ru_logout_button = /** @type {(inputs: Logout_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выйти`)
};

const kk_logout_button = /** @type {(inputs: Logout_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шығу`)
};

const en_logout_button = /** @type {(inputs: Logout_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign out`)
};

/**
* | output |
* | --- |
* | "Sign out" |
*
* @param {Logout_ButtonInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const logout_button = /** @type {((inputs?: Logout_ButtonInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Logout_ButtonInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_logout_button(inputs)
	if (locale === "en") return en_logout_button(inputs)
	return ru_logout_button(inputs)
});