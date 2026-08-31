/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Alias_KindInputs */

const ru_alias_kind = /** @type {(inputs: Alias_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тип справочника`)
};

const kk_alias_kind = /** @type {(inputs: Alias_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық түрі`)
};

const en_alias_kind = /** @type {(inputs: Alias_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionary kind`)
};

/**
* | output |
* | --- |
* | "Dictionary kind" |
*
* @param {Alias_KindInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_kind = /** @type {((inputs?: Alias_KindInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_KindInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_alias_kind(inputs)
	if (locale === "en") return en_alias_kind(inputs)
	return ru_alias_kind(inputs)
});