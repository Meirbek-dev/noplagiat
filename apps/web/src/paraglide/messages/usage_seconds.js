/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ value: NonNullable<unknown> }} Usage_SecondsInputs */

const ru_usage_seconds = /** @type {(inputs: Usage_SecondsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} с`)
};

const kk_usage_seconds = /** @type {(inputs: Usage_SecondsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} с`)
};

const en_usage_seconds = /** @type {(inputs: Usage_SecondsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} s`)
};

/**
* | output |
* | --- |
* | "{value} s" |
*
* @param {Usage_SecondsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_seconds = /** @type {((inputs: Usage_SecondsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Usage_SecondsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_usage_seconds(inputs)
	if (locale === "en") return en_usage_seconds(inputs)
	return ru_usage_seconds(inputs)
});