/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Form_Invalid_JsonInputs */

const ru_form_invalid_json = /** @type {(inputs: Form_Invalid_JsonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Некорректный JSON или структура не соответствует ожидаемой`)
};

const kk_form_invalid_json = /** @type {(inputs: Form_Invalid_JsonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JSON дұрыс емес немесе құрылымы күтілгенге сәйкес келмейді`)
};

const en_form_invalid_json = /** @type {(inputs: Form_Invalid_JsonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Malformed JSON, or the structure does not match`)
};

/**
* | output |
* | --- |
* | "Malformed JSON, or the structure does not match" |
*
* @param {Form_Invalid_JsonInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_invalid_json = /** @type {((inputs?: Form_Invalid_JsonInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_Invalid_JsonInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_form_invalid_json(inputs)
	if (locale === "en") return en_form_invalid_json(inputs)
	return ru_form_invalid_json(inputs)
});