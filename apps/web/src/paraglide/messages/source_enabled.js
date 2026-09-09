/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_EnabledInputs */

const ru_source_enabled = /** @type {(inputs: Source_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Состояние`)
};

const kk_source_enabled = /** @type {(inputs: Source_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Күйі`)
};

const en_source_enabled = /** @type {(inputs: Source_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`State`)
};

/**
* | output |
* | --- |
* | "State" |
*
* @param {Source_EnabledInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_enabled = /** @type {((inputs?: Source_EnabledInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_EnabledInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_enabled(inputs)
	if (locale === "en") return en_source_enabled(inputs)
	return ru_source_enabled(inputs)
});