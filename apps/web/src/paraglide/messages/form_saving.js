/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Form_SavingInputs */

const ru_form_saving = /** @type {(inputs: Form_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сохранение…`)
};

const kk_form_saving = /** @type {(inputs: Form_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сақталуда…`)
};

const en_form_saving = /** @type {(inputs: Form_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saving…`)
};

/**
* | output |
* | --- |
* | "Saving…" |
*
* @param {Form_SavingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const form_saving = /** @type {((inputs?: Form_SavingInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Form_SavingInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_form_saving(inputs)
	if (locale === "en") return en_form_saving(inputs)
	return ru_form_saving(inputs)
});