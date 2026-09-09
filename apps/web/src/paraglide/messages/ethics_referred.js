/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ethics_ReferredInputs */

const ru_ethics_referred = /** @type {(inputs: Ethics_ReferredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Передано`)
};

const kk_ethics_referred = /** @type {(inputs: Ethics_ReferredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Берілді`)
};

const en_ethics_referred = /** @type {(inputs: Ethics_ReferredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Referred`)
};

/**
* | output |
* | --- |
* | "Referred" |
*
* @param {Ethics_ReferredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_referred = /** @type {((inputs?: Ethics_ReferredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_ReferredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_ethics_referred(inputs)
	if (locale === "en") return en_ethics_referred(inputs)
	return ru_ethics_referred(inputs)
});