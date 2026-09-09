/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Internal_Nav_OtherInputs */

const ru_internal_nav_other = /** @type {(inputs: Internal_Nav_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Прочее`)
};

const kk_internal_nav_other = /** @type {(inputs: Internal_Nav_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басқа`)
};

const en_internal_nav_other = /** @type {(inputs: Internal_Nav_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other`)
};

/**
* | output |
* | --- |
* | "Other" |
*
* @param {Internal_Nav_OtherInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_nav_other = /** @type {((inputs?: Internal_Nav_OtherInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Nav_OtherInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_internal_nav_other(inputs)
	if (locale === "en") return en_internal_nav_other(inputs)
	return ru_internal_nav_other(inputs)
});