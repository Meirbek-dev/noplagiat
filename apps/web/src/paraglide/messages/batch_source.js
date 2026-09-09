/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_SourceInputs */

const ru_batch_source = /** @type {(inputs: Batch_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Источник`)
};

const kk_batch_source = /** @type {(inputs: Batch_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дереккөз`)
};

const en_batch_source = /** @type {(inputs: Batch_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source`)
};

/**
* | output |
* | --- |
* | "Source" |
*
* @param {Batch_SourceInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_source = /** @type {((inputs?: Batch_SourceInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_SourceInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_source(inputs)
	if (locale === "en") return en_batch_source(inputs)
	return ru_batch_source(inputs)
});