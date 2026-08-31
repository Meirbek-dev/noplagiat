/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Form_Invalid_NumberInputs */

const ru_form_invalid_number = /** @type {(inputs: Form_Invalid_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Укажите целое неотрицательное число`)
};

const kk_form_invalid_number = /** @type {(inputs: Form_Invalid_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бүтін теріс емес сан көрсетіңіз`)
};

const en_form_invalid_number = /** @type {(inputs: Form_Invalid_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a non-negative whole number`)
};

/**
* | output |
* | --- |
* | "Enter a non-negative whole number" |
*
* @param {Form_Invalid_NumberInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_number = /** @type {((inputs?: Form_Invalid_NumberInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_Invalid_NumberInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_form_invalid_number(inputs)
	if (locale === "en") return en_form_invalid_number(inputs)
	return ru_form_invalid_number(inputs)
});