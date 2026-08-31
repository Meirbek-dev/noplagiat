/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Saved_HintInputs */

const ru_settings_saved_hint = /** @type {(inputs: Settings_Saved_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кэш ответов API сброшен - изменения видны сразу.`)
};

const kk_settings_saved_hint = /** @type {(inputs: Settings_Saved_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API жауаптарының кэші тазаланды - өзгерістер бірден көрінеді.`)
};

const en_settings_saved_hint = /** @type {(inputs: Settings_Saved_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The API response cache was cleared - the change is visible immediately.`)
};

/**
* | output |
* | --- |
* | "The API response cache was cleared - the change is visible immediately." |
*
* @param {Settings_Saved_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_saved_hint = /** @type {((inputs?: Settings_Saved_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Saved_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_settings_saved_hint(inputs)
	if (locale === "en") return en_settings_saved_hint(inputs)
	return ru_settings_saved_hint(inputs)
});