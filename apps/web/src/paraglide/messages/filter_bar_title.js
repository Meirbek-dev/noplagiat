/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Filter_Bar_TitleInputs */

const ru_filter_bar_title = /** @type {(inputs: Filter_Bar_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Фильтры`)
};

const kk_filter_bar_title = /** @type {(inputs: Filter_Bar_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сүзгілер`)
};

const en_filter_bar_title = /** @type {(inputs: Filter_Bar_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filters`)
};

/**
* | output |
* | --- |
* | "Filters" |
*
* @param {Filter_Bar_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_bar_title = /** @type {((inputs?: Filter_Bar_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Bar_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_bar_title(inputs)
	if (locale === "en") return en_filter_bar_title(inputs)
	return ru_filter_bar_title(inputs)
});