/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ethics_Cases_EmptyInputs */

const ru_ethics_cases_empty = /** @type {(inputs: Ethics_Cases_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Реестр Совета по этике за выбранный период пуст.`)
};

const kk_ethics_cases_empty = /** @type {(inputs: Ethics_Cases_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған кезеңдегі Этика кеңесінің тізілімі бос.`)
};

const en_ethics_cases_empty = /** @type {(inputs: Ethics_Cases_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The Ethics Council register is empty for this period.`)
};

/**
* | output |
* | --- |
* | "The Ethics Council register is empty for this period." |
*
* @param {Ethics_Cases_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_cases_empty = /** @type {((inputs?: Ethics_Cases_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_Cases_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_ethics_cases_empty(inputs)
	if (locale === "en") return en_ethics_cases_empty(inputs)
	return ru_ethics_cases_empty(inputs)
});