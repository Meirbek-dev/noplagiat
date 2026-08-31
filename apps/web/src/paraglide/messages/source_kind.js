/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_KindInputs */

const ru_source_kind = /** @type {(inputs: Source_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тип`)
};

const kk_source_kind = /** @type {(inputs: Source_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Түрі`)
};

const en_source_kind = /** @type {(inputs: Source_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kind`)
};

/**
* | output |
* | --- |
* | "Kind" |
*
* @param {Source_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind = /** @type {((inputs?: Source_KindInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_KindInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_kind(inputs)
	if (locale === "en") return en_source_kind(inputs)
	return ru_source_kind(inputs)
});