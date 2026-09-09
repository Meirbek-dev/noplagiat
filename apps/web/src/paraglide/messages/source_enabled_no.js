/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Enabled_NoInputs */

const ru_source_enabled_no = /** @type {(inputs: Source_Enabled_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отключён`)
};

const kk_source_enabled_no = /** @type {(inputs: Source_Enabled_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өшірілген`)
};

const en_source_enabled_no = /** @type {(inputs: Source_Enabled_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disabled`)
};

/**
* | output |
* | --- |
* | "Disabled" |
*
* @param {Source_Enabled_NoInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enabled_no = /** @type {((inputs?: Source_Enabled_NoInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Enabled_NoInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_enabled_no(inputs)
	if (locale === "en") return en_source_enabled_no(inputs)
	return ru_source_enabled_no(inputs)
});