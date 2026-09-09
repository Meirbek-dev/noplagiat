/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Form_ErrorInputs */

const ru_form_error = /** @type {(inputs: Form_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось сохранить`)
};

const kk_form_error = /** @type {(inputs: Form_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сақтау мүмкін болмады`)
};

const en_form_error = /** @type {(inputs: Form_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not save`)
};

/**
* | output |
* | --- |
* | "Could not save" |
*
* @param {Form_ErrorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_error = /** @type {((inputs?: Form_ErrorInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_ErrorInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_form_error(inputs)
	if (locale === "en") return en_form_error(inputs)
	return ru_form_error(inputs)
});