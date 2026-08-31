/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Enabled_YesInputs */

const ru_source_enabled_yes = /** @type {(inputs: Source_Enabled_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включён`)
};

const kk_source_enabled_yes = /** @type {(inputs: Source_Enabled_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қосулы`)
};

const en_source_enabled_yes = /** @type {(inputs: Source_Enabled_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enabled`)
};

/**
* | output |
* | --- |
* | "Enabled" |
*
* @param {Source_Enabled_YesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enabled_yes = /** @type {((inputs?: Source_Enabled_YesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Enabled_YesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_enabled_yes(inputs)
	if (locale === "en") return en_source_enabled_yes(inputs)
	return ru_source_enabled_yes(inputs)
});