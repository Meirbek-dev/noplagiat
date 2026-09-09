/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Form_RequiredInputs */

const ru_form_required = /** @type {(inputs: Form_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Обязательное поле`)
};

const kk_form_required = /** @type {(inputs: Form_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Міндетті өріс`)
};

const en_form_required = /** @type {(inputs: Form_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Required`)
};

/**
* | output |
* | --- |
* | "Required" |
*
* @param {Form_RequiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_required = /** @type {((inputs?: Form_RequiredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_RequiredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_form_required(inputs)
	if (locale === "en") return en_form_required(inputs)
	return ru_form_required(inputs)
});