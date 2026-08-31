/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Form_Invalid_EmailInputs */

const ru_form_invalid_email = /** @type {(inputs: Form_Invalid_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Укажите корректный адрес электронной почты`)
};

const kk_form_invalid_email = /** @type {(inputs: Form_Invalid_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дұрыс электрондық пошта мекенжайын көрсетіңіз`)
};

const en_form_invalid_email = /** @type {(inputs: Form_Invalid_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a valid e-mail address`)
};

/**
* | output |
* | --- |
* | "Enter a valid e-mail address" |
*
* @param {Form_Invalid_EmailInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_email = /** @type {((inputs?: Form_Invalid_EmailInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_Invalid_EmailInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_form_invalid_email(inputs)
	if (locale === "en") return en_form_invalid_email(inputs)
	return ru_form_invalid_email(inputs)
});