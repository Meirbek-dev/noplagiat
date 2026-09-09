/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Internal_Overview_HintInputs */

const ru_internal_overview_hint = /** @type {(inputs: Internal_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Показатели в пределах вашей области видимости.`)
};

const kk_internal_overview_hint = /** @type {(inputs: Internal_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сіздің көріну аймағыңыз шегіндегі көрсеткіштер.`)
};

const en_internal_overview_hint = /** @type {(inputs: Internal_Overview_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Metrics within your area of visibility.`)
};

/**
* | output |
* | --- |
* | "Metrics within your area of visibility." |
*
* @param {Internal_Overview_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const internal_overview_hint = /** @type {((inputs?: Internal_Overview_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Internal_Overview_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_internal_overview_hint(inputs)
	if (locale === "en") return en_internal_overview_hint(inputs)
	return ru_internal_overview_hint(inputs)
});