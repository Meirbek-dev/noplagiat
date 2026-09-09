/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ethics_Cases_TitleInputs */

const ru_ethics_cases_title = /** @type {(inputs: Ethics_Cases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Реестр Совета по этике`)
};

const kk_ethics_cases_title = /** @type {(inputs: Ethics_Cases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Этика кеңесінің тізілімі`)
};

const en_ethics_cases_title = /** @type {(inputs: Ethics_Cases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ethics Council register`)
};

/**
* | output |
* | --- |
* | "Ethics Council register" |
*
* @param {Ethics_Cases_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_cases_title = /** @type {((inputs?: Ethics_Cases_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_Cases_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_ethics_cases_title(inputs)
	if (locale === "en") return en_ethics_cases_title(inputs)
	return ru_ethics_cases_title(inputs)
});