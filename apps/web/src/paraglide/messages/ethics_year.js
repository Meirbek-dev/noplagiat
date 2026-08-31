/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ethics_YearInputs */

const ru_ethics_year = /** @type {(inputs: Ethics_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Учебный год`)
};

const kk_ethics_year = /** @type {(inputs: Ethics_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оқу жылы`)
};

const en_ethics_year = /** @type {(inputs: Ethics_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic year`)
};

/**
* | output |
* | --- |
* | "Academic year" |
*
* @param {Ethics_YearInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_year = /** @type {((inputs?: Ethics_YearInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_YearInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_ethics_year(inputs)
	if (locale === "en") return en_ethics_year(inputs)
	return ru_ethics_year(inputs)
});