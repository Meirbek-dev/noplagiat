/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Cursor_PresentInputs */

const ru_source_cursor_present = /** @type {(inputs: Source_Cursor_PresentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`задан`)
};

const kk_source_cursor_present = /** @type {(inputs: Source_Cursor_PresentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`белгіленген`)
};

const en_source_cursor_present = /** @type {(inputs: Source_Cursor_PresentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`set`)
};

/**
* | output |
* | --- |
* | "set" |
*
* @param {Source_Cursor_PresentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor_present = /** @type {((inputs?: Source_Cursor_PresentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Cursor_PresentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_cursor_present(inputs)
	if (locale === "en") return en_source_cursor_present(inputs)
	return ru_source_cursor_present(inputs)
});