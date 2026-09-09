/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Internal_Nav_PublicInputs */

const ru_internal_nav_public = /** @type {(inputs: Internal_Nav_PublicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Публичный контур`)
};

const kk_internal_nav_public = /** @type {(inputs: Internal_Nav_PublicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ашық контур`)
};

const en_internal_nav_public = /** @type {(inputs: Internal_Nav_PublicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Public contour`)
};

/**
* | output |
* | --- |
* | "Public contour" |
*
* @param {Internal_Nav_PublicInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_public = /** @type {((inputs?: Internal_Nav_PublicInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Nav_PublicInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_internal_nav_public(inputs)
	if (locale === "en") return en_internal_nav_public(inputs)
	return ru_internal_nav_public(inputs)
});