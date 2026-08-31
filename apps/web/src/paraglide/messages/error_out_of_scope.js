/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Out_Of_ScopeInputs */

const ru_error_out_of_scope = /** @type {(inputs: Error_Out_Of_ScopeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выбранное подразделение вне вашей области видимости. Измените фильтр или обратитесь к администратору.`)
};

const kk_error_out_of_scope = /** @type {(inputs: Error_Out_Of_ScopeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған бөлімше сіздің көріну аймағыңыздан тыс. Сүзгіні өзгертіңіз немесе әкімшіге хабарласыңыз.`)
};

const en_error_out_of_scope = /** @type {(inputs: Error_Out_Of_ScopeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The selected unit is outside your area of visibility. Change the filter or contact an administrator.`)
};

/**
* | output |
* | --- |
* | "The selected unit is outside your area of visibility. Change the filter or contact an administrator." |
*
* @param {Error_Out_Of_ScopeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_out_of_scope = /** @type {((inputs?: Error_Out_Of_ScopeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Out_Of_ScopeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_error_out_of_scope(inputs)
	if (locale === "en") return en_error_out_of_scope(inputs)
	return ru_error_out_of_scope(inputs)
});