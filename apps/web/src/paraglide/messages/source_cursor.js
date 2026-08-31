/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_CursorInputs */

const ru_source_cursor = /** @type {(inputs: Source_CursorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Курсор`)
};

const kk_source_cursor = /** @type {(inputs: Source_CursorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Курсор`)
};

const en_source_cursor = /** @type {(inputs: Source_CursorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cursor`)
};

/**
* | output |
* | --- |
* | "Cursor" |
*
* @param {Source_CursorInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_cursor = /** @type {((inputs?: Source_CursorInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_CursorInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_cursor(inputs)
	if (locale === "en") return en_source_cursor(inputs)
	return ru_source_cursor(inputs)
});