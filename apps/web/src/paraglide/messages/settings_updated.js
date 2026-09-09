/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown>, who: NonNullable<unknown> }} Settings_UpdatedInputs */

const ru_settings_updated = /** @type {(inputs: Settings_UpdatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Последнее изменение: ${i?.date}, ${i?.who}`)
};

const kk_settings_updated = /** @type {(inputs: Settings_UpdatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Соңғы өзгеріс: ${i?.date}, ${i?.who}`)
};

const en_settings_updated = /** @type {(inputs: Settings_UpdatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Last changed ${i?.date} by ${i?.who}`)
};

/**
* | output |
* | --- |
* | "Last changed {date} by {who}" |
*
* @param {Settings_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_updated = /** @type {((inputs: Settings_UpdatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_UpdatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_settings_updated(inputs)
	if (locale === "en") return en_settings_updated(inputs)
	return ru_settings_updated(inputs)
});