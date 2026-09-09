/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Base_Url_HintInputs */

const ru_source_base_url_hint = /** @type {(inputs: Source_Base_Url_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Базовый URL для API или каталог для CSV.`)
};

const kk_source_base_url_hint = /** @type {(inputs: Source_Base_Url_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API үшін негізгі URL немесе CSV үшін каталог.`)
};

const en_source_base_url_hint = /** @type {(inputs: Source_Base_Url_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL for an API source, watched directory for a CSV one.`)
};

/**
* | output |
* | --- |
* | "Base URL for an API source, watched directory for a CSV one." |
*
* @param {Source_Base_Url_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_base_url_hint = /** @type {((inputs?: Source_Base_Url_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Base_Url_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_base_url_hint(inputs)
	if (locale === "en") return en_source_base_url_hint(inputs)
	return ru_source_base_url_hint(inputs)
});