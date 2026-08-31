/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ethics_ClosedInputs */

const ru_ethics_closed = /** @type {(inputs: Ethics_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рассмотрено`)
};

const kk_ethics_closed = /** @type {(inputs: Ethics_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қаралды`)
};

const en_ethics_closed = /** @type {(inputs: Ethics_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Closed`)
};

/**
* | output |
* | --- |
* | "Closed" |
*
* @param {Ethics_ClosedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const ethics_closed = /** @type {((inputs?: Ethics_ClosedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ethics_ClosedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_ethics_closed(inputs)
	if (locale === "en") return en_ethics_closed(inputs)
	return ru_ethics_closed(inputs)
});