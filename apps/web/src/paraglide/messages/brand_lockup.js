/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Brand_LockupInputs */

const ru_brand_lockup = /** @type {(inputs: Brand_LockupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toraighyrov University`)
};

const kk_brand_lockup = /** @type {(inputs: Brand_LockupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toraighyrov University`)
};

const en_brand_lockup = /** @type {(inputs: Brand_LockupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toraighyrov University`)
};

/**
* | output |
* | --- |
* | "Toraighyrov University" |
*
* @param {Brand_LockupInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const brand_lockup = /** @type {((inputs?: Brand_LockupInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Brand_LockupInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_brand_lockup(inputs)
	if (locale === "en") return en_brand_lockup(inputs)
	return ru_brand_lockup(inputs)
});