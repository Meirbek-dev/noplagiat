/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Header_Skip_LinkInputs */

const ru_header_skip_link = /** @type {(inputs: Header_Skip_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перейти к содержимому`)
};

const kk_header_skip_link = /** @type {(inputs: Header_Skip_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мазмұнға өту`)
};

const en_header_skip_link = /** @type {(inputs: Header_Skip_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skip to content`)
};

/**
* | output |
* | --- |
* | "Skip to content" |
*
* @param {Header_Skip_LinkInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const header_skip_link = /** @type {((inputs?: Header_Skip_LinkInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Header_Skip_LinkInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_header_skip_link(inputs)
	if (locale === "en") return en_header_skip_link(inputs)
	return ru_header_skip_link(inputs)
});