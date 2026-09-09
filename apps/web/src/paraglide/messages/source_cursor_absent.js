/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Cursor_AbsentInputs */

const ru_source_cursor_absent = /** @type {(inputs: Source_Cursor_AbsentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`не задан`)
};

const kk_source_cursor_absent = /** @type {(inputs: Source_Cursor_AbsentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`белгіленбеген`)
};

const en_source_cursor_absent = /** @type {(inputs: Source_Cursor_AbsentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`not set`)
};

/**
* | output |
* | --- |
* | "not set" |
*
* @param {Source_Cursor_AbsentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor_absent = /** @type {((inputs?: Source_Cursor_AbsentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Cursor_AbsentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_cursor_absent(inputs)
	if (locale === "en") return en_source_cursor_absent(inputs)
	return ru_source_cursor_absent(inputs)
});