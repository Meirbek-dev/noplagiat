/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Program_PlaceholderInputs */

const ru_filter_program_placeholder = /** @type {(inputs: Filter_Program_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PROG01`)
};

const kk_filter_program_placeholder = /** @type {(inputs: Filter_Program_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PROG01`)
};

const en_filter_program_placeholder = /** @type {(inputs: Filter_Program_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PROG01`)
};

/**
* | output |
* | --- |
* | "PROG01" |
*
* @param {Filter_Program_PlaceholderInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_program_placeholder = /** @type {((inputs?: Filter_Program_PlaceholderInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Program_PlaceholderInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_program_placeholder(inputs)
	if (locale === "en") return en_filter_program_placeholder(inputs)
	return ru_filter_program_placeholder(inputs)
});