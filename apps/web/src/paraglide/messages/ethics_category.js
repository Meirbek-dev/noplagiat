/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ethics_CategoryInputs */

const ru_ethics_category = /** @type {(inputs: Ethics_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Категория нарушения`)
};

const kk_ethics_category = /** @type {(inputs: Ethics_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бұзушылық санаты`)
};

const en_ethics_category = /** @type {(inputs: Ethics_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Violation category`)
};

/**
* | output |
* | --- |
* | "Violation category" |
*
* @param {Ethics_CategoryInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_category = /** @type {((inputs?: Ethics_CategoryInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_CategoryInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_ethics_category(inputs)
	if (locale === "en") return en_ethics_category(inputs)
	return ru_ethics_category(inputs)
});