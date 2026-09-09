/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Embed_TitleInputs */

const ru_embed_title = /** @type {(inputs: Embed_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Академическая честность - виджет`)
};

const kk_embed_title = /** @type {(inputs: Embed_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Академиялық адалдық - виджет`)
};

const en_embed_title = /** @type {(inputs: Embed_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic integrity - widget`)
};

/**
* | output |
* | --- |
* | "Academic integrity - widget" |
*
* @param {Embed_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const embed_title = /** @type {((inputs?: Embed_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Embed_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_embed_title(inputs)
	if (locale === "en") return en_embed_title(inputs)
	return ru_embed_title(inputs)
});