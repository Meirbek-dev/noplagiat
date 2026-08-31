/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Form_SavedInputs */

const ru_form_saved = /** @type {(inputs: Form_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сохранено`)
};

const kk_form_saved = /** @type {(inputs: Form_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сақталды`)
};

const en_form_saved = /** @type {(inputs: Form_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved`)
};

/**
* | output |
* | --- |
* | "Saved" |
*
* @param {Form_SavedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_saved = /** @type {((inputs?: Form_SavedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_SavedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_form_saved(inputs)
	if (locale === "en") return en_form_saved(inputs)
	return ru_form_saved(inputs)
});